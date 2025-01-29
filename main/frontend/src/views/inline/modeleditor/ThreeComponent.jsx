import React from "react";
import { withResizeDetector } from "react-resize-detector";
import Scene from "./scene";

class ThreeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.scene = new Scene(
      props.width || 1080,
      props.height || 720,
      props.backgroundColor || "#31353e"
    );

    /* callback for cutline modification */
    this.scene.cutlineUpdate = props.cutlineUpdate;
    this.containerRef = React.createRef();
    this.gui = React.createRef();

    // Creation mode management: callback and status
    this.scene.saveInitPoints = props.saveInitPoints;
    this.scene.setCreating(props.creating);
  }

  componentDidMount() {
    // Append Renderer to DOM
    // this.gui.current.appendChild(this.scene.gui.domElement);
    this.containerRef.current.appendChild(this.scene.renderer.domElement);
    // Hack to disable border / outline of the canvas
    this.scene.renderer.domElement.style.setProperty("outline", "none");
    this.scene.render();
  }

  componentDidUpdate(prevProps) {
    const {
      model,
      cutline,
      archline,
      simulator,
      setSimulator,
      width,
      height,
      editing,
      creating,
      saveInitPoints,
      cutlineUpdate,
      orientation,
      setOrientation,
      transOrRot,
      setLoading,
      collisionIndexes,
      isSavingRequested,
      saveCurrentCutlineCallback,
      meshOpacity,
    } = this.props;

    setLoading(true);

    if (prevProps.meshOpacity !== meshOpacity) {
      if (meshOpacity) {
        this.scene.meshOpacity = 0.7;
      } else {
        this.scene.meshOpacity = 1;
      }
      this.scene.loadModel(model);
    }

    if (prevProps.cutlineUpdate !== cutlineUpdate) {
      this.scene.cutlineUpdate = cutlineUpdate;
    }

    if (prevProps.saveInitPoints !== saveInitPoints) {
      this.scene.saveInitPoints = saveInitPoints;
    }

    if (prevProps.model !== model) {
      this.scene.loadModel(model);
      this.scene.initPoints.resetInitPoints();
      saveInitPoints([]);
    }

    if (prevProps.cutline !== cutline) {
      this.scene.loadCutline(cutline, collisionIndexes);
    }

    if (prevProps.simulator !== simulator) {
      this.scene.loadSimulator(cutline, simulator, setSimulator);
    }

    if (prevProps.archline !== archline) {
      this.scene.loadArchline(archline);
    }

    if (prevProps.width !== width || prevProps.height !== height) {
      this.scene.updateSize(width, height);
    }

    if (prevProps.editing !== editing) {
      this.scene.setEditing(editing);
    }

    if (prevProps.creating !== creating) {
      this.scene.setCreating(creating);
    }

    if (prevProps.orientation !== orientation) {
      this.scene.loadOrientation(orientation, setOrientation);
    }

    if (prevProps.transOrRot !== transOrRot) {
      this.scene.setTransOrRotActivation(transOrRot);
      this.scene.setRotAxisActivation(transOrRot);
    }
    if (prevProps.isSavingRequested !== isSavingRequested) {
      this.scene.isSavingRequested = isSavingRequested;
    }
    if (prevProps.saveCurrentCutlineCallback !== saveCurrentCutlineCallback) {
      this.scene.saveCurrentCutlineCallback = saveCurrentCutlineCallback;
    }
    this.scene.render();
    setLoading(false);
  }

  componentWillUmount() {
    this.containerRef.current.innerHTML = "";
    this.scene.render();
  }

  render() {
    return (
      <div ref={this.containerRef} style={{ border: "1px solid black" }} />
    );
  }
}

export default withResizeDetector(ThreeComponent);

// <div ref={this.gui} style={{ position: "absolute" }} />
