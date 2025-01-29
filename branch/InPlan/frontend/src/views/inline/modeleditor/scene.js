import * as THREE from "three";

import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import TWEEN from "@tweenjs/tween.js";
import createModelMesh from "./model";
import { TransformControls } from "./TransformControls2";

import Cutline from "./cutline";
import Simulator from "./simulator";
import { TrackballControls } from "./TrackballControls";
import ObjectControl from "./ObjectControl";
import InitialisationPoints from "./initialisationPoints";

const argFact = (compareFn) => (array) =>
  array.map((el, idx) => [el, idx]).reduce(compareFn)[1];
const argMin = argFact((max, el) => (el[0] < max[0] ? el : max));

function proj(vOf, vOn) {
  /* Projection of vOf on vOn */
  const bN = vOn.clone().normalize();
  const a1 = bN.multiplyScalar(bN.dot(vOf));
  const a2 = a1.clone().multiplyScalar(-1).add(vOf);
  /* a1 is the projection and a2 is the rejection */
  /* https://en.wikipedia.org/wiki/Vector_projection */
  return [a1, a2];
}

function toVector(pFrom, pTo) {
  return new THREE.Vector3(pTo.x - pFrom.x, pTo.y - pFrom.y, pTo.z - pFrom.z);
}

/* eslint-disable max-lines */
class Scene {
  constructor(width, height, bgColor) {
    const scene = new THREE.Scene();
    this.scene = scene;

    this.width = width;
    this.height = height;

    /* Camera */
    this.camera = this.initCamera();

    /* Renderer */
    this.renderer = this.initRenderer(bgColor || "#d6d5ff");

    /* Camera control */
    this.cameraControl = this.initCameraControl();

    /* Object control */
    this.objectControl = this.initObjectControl();
    this.mousePosition = null;
    this.editing = true;
    this.creating = false;

    /* Initialize group: container of modelAndCutline to apply tranlations */
    this.group = this.initGroup();

    /* Initialize container of model and cutline to apply rotations */
    this.modelAndCutline = this.initmodelAndCutline();

    /* Lights */
    this.initLights();

    /* Set to a function to be call when click on object */
    this.attachedObject = null;
    this.cutControl = null;
    this.archControl = null;
    this.initPointsControl = null;
    this.objectControlCallback = null;
    this.objectControlFinishCallback = null;

    /* Initialize Model and Cutline */
    this.modelUrl = null;
    this.model = this.initModel();
    // FIXME: What is archline??
    this.archline = this.initArchline();
    this.cutline = this.initCutline();
    this.simulator = this.initSimulator();
    this.initPoints = this.initInitPoints(); // init points are used to initilize the primilary cutline
    this.focusPoint = [0, 0, 0]; // the focus point is used to manage the camera round it

    /* Opacity */
    this.meshOpacity = 1;

    /* Initialize contole of object */
    this.modelControl = this.initModelControl();

    /* React callbacks */
    this.cutlineUpdate = null;
    this.saveInitPoints = null;
    this.saveCurrentCutlineCallback = null;

    /* This trigger is activated in dashboard context to force the scene to save */
    this.isSavingRequested = false;

    /* GUI params */
    this.params = this.initParams();
    this.gui = this.initGui();

    /* Model position */
    this.modelCenter = new THREE.Vector3(0, 0, 0);

    /* Main loop */
    this.mainLoop();

    this.render();
  }

  updateSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  initObjectControl() {
    const transformControl = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    transformControl.addEventListener("change", this.render);

    transformControl.addEventListener("dragging-changed", (event) => {
      this.cameraControl.enabled = !event.value;
      this.modelControl.enabled = !event.value;
    });

    transformControl.addEventListener("mouseUp", () => {
      if (this.objectControlFinishCallback) {
        this.objectControlFinishCallback();
      }
    });

    transformControl.addEventListener("objectChange", () => {
      if (this.objectControlCallback) {
        this.objectControlCallback();
      }
    });

    this.scene.add(transformControl);
    return transformControl;
  }

  initGroup() {
    const group = new THREE.Group();
    this.scene.add(group);
    this.render();
    return group;
  }

  initmodelAndCutline() {
    const modelAndCutline = new THREE.Group();
    this.group.add(modelAndCutline);
    this.render();
    return modelAndCutline;
  }

  initCameraControl() {
    const controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    controls.enabled = true;

    controls.addEventListener("change", this.render);

    controls.rotateSpeed = 20.0;
    return controls;
  }

  initModelControl() {
    const controls = new ObjectControl(
      this.modelAndCutline,
      this.group,
      this.renderer.domElement
    );
    controls.activeTrans = false;
    controls.activeRot = false;

    controls.addEventListener("change", this.render);
    return controls;
  }

  initGrid() {
    const helper = new THREE.GridHelper(100, 100);
    helper.rotation.set(-Math.PI / 2, 0, 0);
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    this.scene.add(helper);
    return helper;
  }

  initRenderer(bgColor) {
    // Create a renderer with Antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Configure renderer clear color
    renderer.setClearColor(bgColor);

    // Configure renderer size
    renderer.setSize(this.width, this.height);

    renderer.domElement.addEventListener("mousedown", (event) => {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(this.mousePosition, this.camera);

      const intersects = raycaster.intersectObjects(
        this.modelAndCutline.children
      );
      this.click(intersects, event);
      this.objectControl.dispatchEvent(event);
    });

    renderer.domElement.addEventListener("mousemove", (event) => {
      const mouse = new THREE.Vector2();
      const base = event.target.getBoundingClientRect();
      mouse.x = ((event.clientX - base.left) / this.width) * 2 - 1;
      mouse.y = -((event.clientY - base.top) / this.height) * 2 + 1;
      this.mousePosition = mouse;
    });

    document.body.appendChild(renderer.domElement);

    document.addEventListener(
      "keydown",
      (event) => {
        this.onDocumentKeyDown(event);
      },
      false
    );

    return renderer;
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(
      30,
      this.width / this.height,
      0.5,
      1000
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200;
    return camera;
  }

  initLights() {
    [
      [0, 150, 300],
      [0, 150, -300],
      [0, -150, 0],
    ].forEach((pos) => {
      const spotLight = new THREE.SpotLight();
      spotLight.position.set(pos[0], pos[1], pos[2]);
      this.group.add(spotLight);
    });
  }

  initParams = () => {
    const params = {
      above: this.moveCameraAbove,
      front: this.moveCameraFront,
      right: this.moveCameraRight,
      left: this.moveCameraLeft,
      back: this.moveCameraBack,
      below: this.moveCameraBelow,
    };

    return params;
  };

  moveCameraTo = (position, normal) => {
    this.cameraControl.enabled = false;

    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(
      normal.clone().normalize(),
      this.camera.position.clone().normalize()
    );
    const translationSource = {
      x: this.group.position.x,
      y: this.group.position.y,
      z: this.group.position.z,
    };
    const translationTarget = {
      /* translate he selected point to the middle */
      x: -position.x + this.modelCenter.x,
      y: -position.y + this.modelCenter.y,
      z: -position.z + this.modelCenter.z,
    };

    const tween = new TWEEN.Tween(translationSource).to(
      translationTarget,
      1000
    );
    tween.onUpdate(() => {
      this.group.position.x = translationSource.x;
      this.group.position.y = translationSource.y;
      this.group.position.z = translationSource.z;

      this.render();
    });

    tween.onComplete(() => {
      this.cameraControl.enabled = true;
    });

    tween.start();
  };

  moveObjectTo = (protation) => {
    const tsrc = {
      tx: this.modelAndCutline.rotation.x,
      ty: this.modelAndCutline.rotation.y,
      tz: this.modelAndCutline.rotation.z,
    };
    const ttarget = {
      tx: protation.x,
      ty: protation.y,
      tz: protation.z,
    };

    const tween = new TWEEN.Tween(tsrc).to(ttarget, 1000);
    tween.onUpdate(() => {
      const euler = new THREE.Euler(tsrc.tx, tsrc.ty, tsrc.tz, "XYZ");
      this.modelAndCutline.setRotationFromEuler(euler);
      this.render();
    });

    tween.start();
  };

  moveObjectAbove = () => this.moveObjectTo({ x: 0, y: 0, z: 0 });

  moveObjectFront = () =>
    this.moveObjectTo({ x: -Math.PI / 2, y: 0, z: Math.PI });

  moveObjectRight = () =>
    this.moveObjectTo({ x: -Math.PI / 2, y: 0, z: Math.PI / 2 });

  moveObjectLeft = () =>
    this.moveObjectTo({ x: -Math.PI / 2, y: 0, z: -Math.PI / 2 });

  moveObjectBack = () => this.moveObjectTo({ x: -Math.PI / 2, y: 0, z: 0 });

  moveObjectBelow = () => this.moveObjectTo({ x: 0, y: Math.PI, z: 0 });

  moveCameraAbove = () =>
    this.moveCameraTo(new THREE.Vector3(0, 75, 0), new THREE.Vector3(0, -1, 0));

  moveCameraFront = () =>
    this.moveCameraTo(
      new THREE.Vector3(0, -65, 0),
      new THREE.Vector3(0, -1, 0)
    );

  moveCameraRight = () =>
    this.moveCameraTo(new THREE.Vector3(65, 0, 0), new THREE.Vector3(1, 0, 0));

  moveCameraLeft = () =>
    this.moveCameraTo(
      new THREE.Vector3(-65, 0, 0),
      new THREE.Vector3(-1, 0, 0)
    );

  moveCameraBack = () =>
    this.moveCameraTo(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, 1, 0));

  moveCameraBelow = () =>
    this.moveCameraTo(
      new THREE.Vector3(0, 0, -65),
      new THREE.Vector3(0, 0, -1)
    );

  initGui = () => {
    const gui = new GUI({ autoPlace: false });

    gui.add(this.params, "above");
    gui.add(this.params, "front");
    gui.add(this.params, "right");
    gui.add(this.params, "left");
    gui.add(this.params, "back");
    gui.add(this.params, "below");
    gui.close();
    return gui;
  };

  initModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const material = new THREE.MeshStandardMaterial({
      color: "#e3dac9",
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.modelAndCutline.add(mesh);
    this.modelCenter = new THREE.Vector3(0, 0, 0);
    return mesh;
  }

  initCutline() {
    return new Cutline(this.modelAndCutline, true, true);
  }

  initArchline() {
    return new Cutline(this.modelAndCutline, true, false);
  }

  initSimulator() {
    return new Simulator(this);
  }

  initInitPoints() {
    return new InitialisationPoints(this.modelAndCutline);
  }

  project(point) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mousePosition, this.camera);
    const intersects = raycaster.intersectObject(this.model);

    if (intersects.length > 0) {
      point.position.copy(this.model.worldToLocal(intersects[0].point));
    }
    this.cutline.update();
  }

  project2(point) {
    const raycaster = new THREE.Raycaster();

    const vec = new THREE.Vector3(0, 0, -1);
    const origin = new THREE.Vector3();
    origin.copy(point.position);
    origin.z += 50;

    raycaster.set(origin, vec);

    const intersects = raycaster.intersectObject(this.mesh);

    if (intersects.length > 0 && point) {
      point.position.copy(this.model.worldToLocal(intersects[0].point));
    }
    this.update();
  }

  setEditing(flag) {
    this.editing = flag;
    this.objectControl.detach();
  }

  setCreating(flag) {
    this.creating = flag;
    // this.objectControl.detach();
    if (flag === false) {
      this.initPoints.resetInitPoints();
    }
  }

  click(objects, event) {
    if (objects.length > 0 && this.editing) {
      const i = 0;
      this.cutControl = this.cutline.isControlPoint(objects[i].object);
      this.archControl = this.archline.isControlPoint(objects[i].object);
      this.initPointsControl = this.initPoints.isControlPoint(
        objects[i].object
      );

      if (this.cutControl || this.archControl || this.initPointsControl) {
        this.objectControl.detach();
        this.objectControl.attach(objects[i].object);
        this.attachedObject = objects[i].object;

        this.render();
      } else if (event.ctrlKey) {
        try {
          this.addPoint(this.modelAndCutline.worldToLocal(objects[i].point));
        } catch (error) {
          console.error(error);
        }
      }

      // 2023 05 05 - does not work because alt is catched by browser
      if (event.altKey) {
        this.focusOn(objects[i]);
      }

      // Update the cutline path - not useful for init points
      if (this.cutControl) {
        this.objectControlCallback = this.cutline.update;
        this.objectControlFinishCallback = () => {
          this.project(this.attachedObject);
          if (this.cutlineUpdate) {
            this.cutlineUpdate(this.cutline.save());
          }
          this.objectControl.detach();
        };
      } else if (this.archControl) {
        this.objectControlCallback = this.archline.update;
      } else if (this.initPointsControl) {
        // Free the selection at mouse click going back up
        this.objectControlFinishCallback = () => {
          this.objectControl.detach();
        };
      }
    } else {
      this.objectControl.detach();
    }
  }

  applyTriggeredSave = () => {
    if (this.isSavingRequested && this.saveCurrentCutlineCallback) {
      this.saveCurrentCutlineCallback(this.cutline.save());
    }
  };

  mainLoop() {
    requestAnimationFrame(() => {
      this.mainLoop();
    });
    if (this.cameraControl) {
      this.cameraControl.update();
    }
    this.modelControl.update();
    TWEEN.update();
    this.applyTriggeredSave();
  }

  addPoint(target) {
    if (this.creating) {
      this.addAnInitPoint(target);
    } else {
      this.attachedObject = null;
      this.objectControl.detach();
      let controlPoints = [];
      if (
        this.archline.controlPoints &&
        this.archline.controlPoints.length > 0
      ) {
        controlPoints = this.archline.controlPoints;
      } else if (
        this.cutline.controlPoints &&
        this.cutline.controlPoints.length > 0
      ) {
        controlPoints = this.cutline.controlPoints;
      }

      // This code is used to find where to put the point in the list
      // which are the nearest existing points

      const pts = controlPoints.map((p) => p.position);

      const distances = pts.map((p, i) => {
        const vOf = toVector(p, target);
        const vOn = toVector(p, i < pts.length - 1 ? pts[i + 1] : pts[0]);
        const [a1, a2] = proj(vOf, vOn);
        const onseg = a1.length() < vOn.length() && a1.dot(vOn) > 0;
        return onseg ? a2.length() : Infinity;
      });

      const principal = argMin(distances);

      pts.splice(principal + 1, 0, target);

      if (this.archline.controlPoints.length > 0) {
        this.archline.update(pts);
        this.archline.resetControlPoints(pts);
        this.render();
      } else if (this.cutline.controlPoints.length > 0) {
        this.cutline.update(pts);
        this.cutline.resetControlPoints(pts);
        if (this.cutlineUpdate) {
          this.cutlineUpdate(this.cutline.save());
        }
        this.render();
      }
    }
  }

  addAnInitPoint(target) {
    if (this.initPoints.controlPoints) {
      const pts = this.initPoints.controlPoints.map((p) => p.position);
      pts.push(target);
      if (this.saveInitPoints) {
        this.saveInitPoints(pts);
      }
      this.initPoints.resetControlPoints(pts);
    }
  }

  loadModel(modelUrl) {
    this.modelUrl = modelUrl;
    this.modelAndCutline.remove(this.model);
    // this.initPoints.resetInitPoints(); // FIXME Not good because reset even if reloading the same model
    this.render();

    if (!modelUrl) {
      this.initPoints.resetInitPoints();
      return;
    }

    createModelMesh(modelUrl, this.model.material, true, this.meshOpacity).then(
      (mesh) => {
        if (this.model) {
          this.scene.remove(this.model);
          this.modelAndCutline.remove(this.model);
        }
        if (!this.modelUrl) {
          return;
        }

        this.model = mesh;
        this.cutline.mesh = mesh;
        this.initPoints.mesh = mesh;

        this.modelAndCutline.add(this.model);

        /* Calculate center for camera management */
        mesh.geometry.computeBoundingBox();
        mesh.geometry.boundingBox.getCenter(this.modelCenter);

        this.render();
      }
    );
  }

  loadCutline(points, collisionIndexes = null) {
    this.objectControl.detach();

    if (collisionIndexes) {
      this.cutline.loadColors(this.editing, collisionIndexes);
    }

    this.cutline.loadPoints(points);
    this.initPoints.resetInitPoints();
    this.render();
  }

  loadSimulator(points, start, setSimulator) {
    this.simulator.load(points, start, setSimulator);
  }

  loadOrientation(orientation, setOrientation) {
    switch (orientation) {
      case "top":
        this.moveObjectAbove();
        setOrientation("");
        break;
      case "bottom":
        this.moveObjectBelow();
        setOrientation("");
        break;
      case "left":
        this.moveObjectLeft();
        setOrientation("");
        break;
      case "right":
        this.moveObjectRight();
        setOrientation("");
        break;
      case "front":
        this.moveObjectFront();
        setOrientation("");
        break;
      case "back":
        this.moveObjectBack();
        setOrientation("");
        break;
      default:
        break;
    }
  }

  setTransOrRotActivation({ activeTrans, activeRot }) {
    this.modelControl.activeTrans = activeTrans;
    this.modelControl.activeRot = activeRot;
  }

  setRotAxisActivation({ x, y, z }) {
    this.modelControl.rotateX = x;
    this.modelControl.rotateY = y;
    this.modelControl.rotateZ = z;
  }

  loadArchline(points) {
    this.objectControl.detach();
    this.archline.loadPoints(points);
    this.render();
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  focusOn(obj) {
    const { face, point } = obj;
    const position = point.clone();
    let normal = new THREE.Vector3(0, 1, 0);
    if (face) {
      normal = face.normal.clone();
      position.add(normal.multiplyScalar(20));
    } else {
      position.x = 0;
      position.y = -60;
      position.z = 40;
    }

    this.moveCameraTo(point, normal);
  }

  onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 46:
        if (this.archControl && this.archline.controlPoints.length > 2) {
          this.archControl = false;
          this.archline.deletePoint(this.attachedObject);
          this.attachedObject = null;
          this.objectControl.detach();
          this.render();
        } else if (this.cutControl && this.cutline.controlPoints.length > 2) {
          this.cutControl = false;
          this.cutline.deletePoint(this.attachedObject);
          this.attachedObject = null;
          this.objectControl.detach();
          this.render();
        } else if (this.initPointsControl) {
          this.initPointsControl = false;
          this.initPoints.deletePoint(this.attachedObject);
          this.attachedObject = null;
          this.objectControl.detach();
          // Update the saved points
          if (this.saveInitPoints && this.initPoints.controlPoints) {
            const pts = this.initPoints.controlPoints.map((p) => p.position);
            this.saveInitPoints(pts);
          }
          this.render();
        }

        break;
      // no default
    }
  }
}

export default Scene;
