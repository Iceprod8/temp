import * as THREE from "three";

class InitialisationPoints {
  constructor(parent) {
    this.controlPoints = [];
    this.material = new THREE.MeshLambertMaterial({ color: 0xff00ff });

    this.parent = parent;
    this.strict = false;
    this.closed = false;
  }

  load(points) {
    if (!points) {
      this.resetInitPoints();
      return;
    }

    /* Convert list of list into list of 3d points */
    const controlPoints = points.map(
      (p) => new THREE.Vector3(p[0], p[1], p[2]),
    );

    // this.update(controlPoints);
    this.resetControlPoints(controlPoints);
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

    const controlPointsGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const controlPointObjects = controlPoints.map((p) => {
      const controlPointsMaterial = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
      });

      const m = new THREE.Mesh(controlPointsGeometry, controlPointsMaterial);
      m.position.copy(p);
      this.parent.add(m);
      return m;
    });

    this.controlPoints = controlPointObjects;
  }

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
      // this.update();
    }
  }

  resetInitPoints() {
    this.resetControlPoints(null);
    this.controlPoints = [];
  }
}

export default InitialisationPoints;
