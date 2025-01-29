import * as THREE from "three";

class Cutline {
  constructor(parent, strict, closed) {
    // FIXME what is controlPointsSize
    this.controlPointsSize = (32 + 2) * 2 * 4;

    this.controlPoints = [];
    this.lineColor = 0xff00ff;
    this.lineMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffcc });

    // Control points for editing are blue and big
    this.controlPointsGeometry = new THREE.SphereBufferGeometry(0.4, 16, 16);
    this.controlPointsMaterial = new THREE.MeshLambertMaterial({
      color: 0x8800ff,
    });

    // Correct points for the cutline are green
    this.goodCutlinePointGeometry = new THREE.SphereBufferGeometry(0.1, 16, 16);
    this.goodCutlinePointMaterial = new THREE.MeshLambertMaterial({
      color: 0x00ff00,
    });

    // Notices points for the cutline are yellow - orange and medium
    this.notiCutlinePointGeometry = new THREE.SphereBufferGeometry(0.2, 16, 16);
    this.notiCutlinePointMaterial = new THREE.MeshLambertMaterial({
      color: 0x8888ff,
    });

    // Warning points for the cutline are yellow - orange and medium
    this.warnCutlinePointGeometry = new THREE.SphereBufferGeometry(0.2, 16, 16);
    this.warnCutlinePointMaterial = new THREE.MeshLambertMaterial({
      // color: 0xff8855,
      color: 0x4444ff,
    });

    // Error points for the cutline are red and medium
    this.badCutlinePointGeometry = new THREE.SphereBufferGeometry(0.2, 16, 16);
    this.badCutlinePointMaterial = new THREE.MeshLambertMaterial({
      // color: 0xff4400,
      color: 0x0000ff,
    });

    this.cutline = null;

    this.parent = parent;
    this.strict = strict || false;
    this.closed = closed || false;

    // Data used to color the point on the final cutline, for collision detection
    this.isCutlineEditable = true;
    this.noticeIndexes = [];
    this.warningIndexes = [];
    this.errorIndexes = [];
  }

  createNewPoint(pointPosition, geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(pointPosition);
    this.parent.add(mesh);
    return mesh;
  }

  loadPoints(points) {
    if (!points) {
      this.resetControlPoints(null);
      this.controlPoints = [];
      this.parent.remove(this.cutline);
      this.cutline = null;
      return;
    }

    /* Convert list of list into list of 3d points */
    let controlPoints = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));

    if (!this.strict) {
      /* Create a curve along this points */
      const curve = new THREE.CatmullRomCurve3(controlPoints);

      /* Get the position of control points */
      controlPoints = curve.getPoints(this.controlPointsSize / 2);
    }
    this.update(controlPoints);
    this.resetControlPoints(controlPoints);
  }

  // Called before load point to update colors. Could be combined with loadPoints
  loadColors(isCutlineEditable, collisionIndexes) {
    this.isCutlineEditable = isCutlineEditable;
    this.noticeIndexes = collisionIndexes.notices
      ? collisionIndexes.notices
      : [];
    this.warningIndexes = collisionIndexes.warnings
      ? collisionIndexes.warnings
      : [];
    this.errorIndexes = collisionIndexes.errors ? collisionIndexes.errors : [];
  }

  save() {
    const controlPoints = this.controlPoints.map((p) => {
      const { x, y, z } = p.position;
      return [x, y, z];
    });
    return controlPoints;
  }

  resetControlPoints(controlPoints) {
    /* Remove all previous control points */
    for (let c = 0; c < this.controlPoints.length; c += 1) {
      this.parent.remove(this.controlPoints[c]);
    }

    if (!controlPoints) {
      return;
    }

    const controlPointObjects = controlPoints.map((pointPoistion, index) => {
      let newPoint = null;
      if (this.isCutlineEditable) {
        newPoint = this.createNewPoint(
          pointPoistion,
          this.controlPointsGeometry,
          this.controlPointsMaterial
        );
      } else if (this.errorIndexes.includes(index)) {
        newPoint = this.createNewPoint(
          pointPoistion,
          this.badCutlinePointGeometry,
          this.badCutlinePointMaterial
        );
      } else if (this.warningIndexes.includes(index)) {
        newPoint = this.createNewPoint(
          pointPoistion,
          this.warnCutlinePointGeometry,
          this.warnCutlinePointMaterial
        );
      } else if (this.noticeIndexes.includes(index)) {
        newPoint = this.createNewPoint(
          pointPoistion,
          this.notiCutlinePointGeometry,
          this.notiCutlinePointMaterial
        );
      } else {
        newPoint = this.createNewPoint(
          pointPoistion,
          this.goodCutlinePointGeometry,
          this.goodCutlinePointMaterial
        );
      }
      return newPoint;
    });

    this.controlPoints = controlPointObjects;
  }

  update = (controlPoints) => {
    const localControlPoints =
      controlPoints || this.controlPoints.map((p) => p.position);

    /* Create the cutline mesh and load it */
    const displayCurve = new THREE.CatmullRomCurve3(localControlPoints);

    const tubeGeometry = new THREE.TubeBufferGeometry(
      displayCurve,
      this.controlPointsSize * 2,
      0.05,
      8,
      this.closed
    );

    if (this.cutline) {
      this.cutline.geometry.copy(tubeGeometry);
    } else {
      this.cutline = new THREE.Mesh(tubeGeometry, this.lineMaterial);
      this.parent.add(this.cutline);
    }
  };

  isControlPoint(object) {
    for (let c = 0; c < this.controlPoints.length; c += 1) {
      if (this.controlPoints[c] === object) return true;
    }
    return false;
  }

  deletePoint(point) {
    if (point) {
      this.controlPoints.splice(this.controlPoints.indexOf(point), 1);
      this.parent.remove(point);
      this.update();
    }
  }
}

export default Cutline;
