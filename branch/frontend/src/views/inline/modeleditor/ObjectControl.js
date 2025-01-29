import { EventDispatcher, Quaternion, Euler, Vector2 } from "three";

class ObjectControl extends EventDispatcher {
  constructor(object, group, domElement) {
    super();

    const scope = this;
    this.object = object;
    this.group = group;
    this.domElement = domElement;
    this.document = domElement;
    // API

    this.enabled = true;
    this.activeRot = false;
    this.activeTrans = false;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 0.2;
    this.translateSpeed = 0.3;

    let isRotate = false;
    let isTranslate = false;

    this.rotateX = 1;
    this.rotateY = 1;
    this.rotateZ = 0;

    let movePrev = new Vector2();
    let moveCurr = new Vector2();
    let translateStart = new Vector2();
    let translateEnd = new Vector2();

    // internals
    const changeEvent = { type: "change" };

    // for reset

    // methods

    this.handleResize = function handleResize() {
      const box = scope.domElement.getBoundingClientRect();
      // adjustments come from similar code in the jquery offset() function
      const d = scope.domElement.ownerDocument.documentElement;
      scope.screen.left = box.left + window.pageXOffset - d.clientLeft;
      scope.screen.top = box.top + window.pageYOffset - d.clientTop;
      scope.screen.width = box.width;
      scope.screen.height = box.height;
    };

    this.rotateCamera = (function rotateCamera() {
      const deltaMove = new Vector2();
      return function rotateCamera2() {
        deltaMove.copy(moveCurr).sub(movePrev);
        const deltaRotationQuaternion = new Quaternion().setFromEuler(
          new Euler(
            deltaMove.y * (Math.PI / 180) * this.rotateSpeed * this.rotateX,
            deltaMove.x * (Math.PI / 180) * this.rotateSpeed, // * this.rotateY,
            0 * deltaMove.x * (Math.PI / 180) * this.rotateSpeed * this.rotateZ, // 0, no rotation in this angle as the mouth is 2D
            "XYZ",
          ),
        );

        this.object.quaternion.multiplyQuaternions(
          deltaRotationQuaternion,
          this.object.quaternion,
        );
        movePrev.copy(moveCurr);
      };
    })();

    this.translateCamera = (function translateCamera() {
      const deltaMove = new Vector2();
      return function translateCamera2() {
        deltaMove.copy(translateEnd).sub(translateStart);
        group.translateX(deltaMove.x * this.translateSpeed);
        group.translateY(-deltaMove.y * this.translateSpeed);
        translateStart.copy(translateEnd);
      };
    })();

    this.update = function update() {
      if (isRotate && this.enabled) {
        this.rotateCamera();
      } else if (isTranslate && this.enabled) {
        this.translateCamera();
      }

      if (this.enabled && (isRotate || isTranslate)) {
        this.dispatchEvent(changeEvent);
      }
    };

    // listeners

    // 0 : left button
    // 1 : middle button
    // 2 : Right button

    function onMouseDown(event) {
      if (scope.activeTrans && !scope.activeRot) {
        isTranslate = event.button === 2 || event.button === 0;
      } else if (scope.activeRot && !scope.activeTrans) {
        isRotate = event.button === 2 || event.button === 0;
      } else {
        isRotate = event.button === 0;
        isTranslate = event.button === 2;
      }
    }

    function onMouseMove(event) {
      const vect = new Vector2(event.offsetX, event.offsetY);
      if (isRotate) {
        moveCurr.copy(vect);
        if (movePrev.x === 0 && movePrev.y === 0) {
          movePrev.copy(vect);
        }
      }
      if (isTranslate) {
        translateEnd.copy(vect);
        if (translateStart.x === 0 && translateStart.y === 0) {
          translateStart.copy(vect);
        }
        // movement.copy(new Vector2(event.movementX, event.movementY));
      }
    }

    function onMouseUp() {
      isRotate = false;
      isTranslate = false;
      movePrev = new Vector2();
      moveCurr = new Vector2();
      translateStart = new Vector2();
      translateEnd = new Vector2();
    }

    this.document.addEventListener("mouseup", onMouseUp);
    this.document.addEventListener("mouseout", onMouseUp);
    this.document.addEventListener("mousemove", onMouseMove);
    this.document.addEventListener("mousedown", onMouseDown);

    this.handleResize();
    onMouseUp();

    // force an update at start
    this.update();
  }
}

export default ObjectControl;
