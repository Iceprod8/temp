import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

class Simulator {
  constructor(parent) {
    this.controlPoints = [];
    this.material = new THREE.MeshLambertMaterial({ color: 0x772200 });
    this.simulator = null;

    this.parent = parent.modelAndCutline;
    this.render = parent.render;
    // this.cameraControl = parent.cameraControl;
  }

  load(points, start, setState) {
    if (!points) {
      this.controlPoints = [];
      this.parent.remove(this.simulator);
      this.simulator = null;
      return;
    }

    /* Convert list of list into list of 3d points and rotation */
    const controlPoints = points.map((p) => {
      const v = new THREE.Vector3(p[0], p[1], p[2]);
      return { v, w: p[3] };
    });
    if (controlPoints[0]) {
      // this.cameraControl.target.set(
      //   controlPoints[0].v.x,
      //   controlPoints[0].v.y,
      //   controlPoints[0].v.z
      // );
      // this.cameraControl.maxAzimutAngle = [-2 * Math.PI, 2 * Math.PI];
    }

    this.update(controlPoints, start, setState);
  }

  update = (controlPoints, start, setState) => {
    const cone = new THREE.ConeGeometry(5, 20, 10);

    const first = controlPoints || this.controlPoints;

    if (this.simulator) {
      this.simulator.geometry.copy(cone);
    } else {
      this.simulator = new THREE.Mesh(cone, this.material);
      this.parent.add(this.simulator);
    }

    const src = {
      t: 0,
    };
    const tgt = {
      t: first.length - 1,
    };
    if (start) {
      if (first) {
        const tween = new TWEEN.Tween(src).to(tgt, 10000);
        tween.onUpdate(() => {
          if (this.simulator) {
            const t = Math.floor(src.t);
            const pt = first[t];
            const w = (-pt.w + 180) * (Math.PI / 180);
            this.simulator.position.x = pt.v.x + 10 * Math.sin(w);
            this.simulator.position.y = pt.v.y - 10 * Math.cos(w);
            this.simulator.position.z = pt.v.z;
            this.simulator.rotation.z = w;

            this.render();
          }
        });

        tween.onComplete(() => {
          setState((prev) => ({ ...prev, simulator: false }));
          this.parent.remove(this.simulator);
          this.render();
        });

        tween.onStart(() => {
          if (this.simulator) {
            this.parent.add(this.simulator);
          }
        });
        tween.update();
        TWEEN.removeAll();
        tween.start();
      }
    } else {
      TWEEN.removeAll();
      this.parent.remove(this.simulator);
    }

    // animate();
  };
}

export default Simulator;
