import React, { useRef, useEffect } from "react";
import { useInlineContext } from "@inplan/contexts/InlineContext";
import Scene from "./scene";

export default function ThreeComponent({ setLoading, meshOpacity }) {
  const containerRef = useRef();
  const sceneRef = useRef();
  const prevDataRef = useRef({});

  const {
    cutlineUpdate,
    saveInitPoints,
    currentModel: model,
    currentCutline: cutline,
    creating: creationMode,
    simulator,
    orientation,
    transOrRot,
    collisionIndexes,
    isSavingRequested,
    setState,
    saveCurrentCutline,
  } = useInlineContext();

  useEffect(() => {
    sceneRef.current = new Scene(1080, 720, "#31353e");

    if (containerRef.current) {
      containerRef.current.appendChild(sceneRef.current.renderer.domElement);
      sceneRef.current.renderer.domElement.style.setProperty("outline", "none");
      sceneRef.current.render();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      sceneRef.current.render();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    setLoading(true);
    const prevData = prevDataRef.current;
    if (prevData.model !== model) {
      scene.loadModel(model);
      scene.initPoints.resetInitPoints();
      if (saveInitPoints) saveInitPoints([]);
    }
    if (prevData.meshOpacity !== meshOpacity)
      scene.meshOpacity = meshOpacity ? 0.7 : 1;
    if (
      prevData.cutline !== cutline ||
      prevData.collisionIndexes !== collisionIndexes
    )
      scene.loadCutline(cutline, collisionIndexes);
    if (prevData.simulator !== simulator)
      scene.loadSimulator(cutline, simulator, setState);
    if (prevData.orientation !== orientation)
      scene.loadOrientation(orientation, setState);
    if (prevData.transOrRot !== transOrRot) {
      scene.setTransOrRotActivation(transOrRot);
      scene.setRotAxisActivation(transOrRot);
    }
    if (prevData.creationMode !== creationMode) scene.setCreating(creationMode);
    if (prevData.isSavingRequested !== isSavingRequested)
      scene.isSavingRequested = isSavingRequested;
    if (prevData.saveCurrentCutline !== saveCurrentCutline)
      scene.saveCurrentCutlineCallback = saveCurrentCutline;
    if (prevData.cutlineUpdate !== cutlineUpdate)
      scene.cutlineUpdate = cutlineUpdate;
    scene.render();
    setLoading(false);
    prevDataRef.current = {
      model,
      cutline,
      meshOpacity,
      cutlineUpdate,
      simulator,
      orientation,
      transOrRot,
      collisionIndexes,
      isSavingRequested,
      saveCurrentCutline,
      creationMode,
    };
  }, [
    model,
    meshOpacity,
    cutline,
    cutlineUpdate,
    simulator,
    orientation,
    transOrRot,
    collisionIndexes,
    isSavingRequested,
    saveCurrentCutline,
    creationMode,
    setLoading,
    saveInitPoints,
    setState,
  ]);

  return <div ref={containerRef} style={{ border: "1px solid black" }} />;
}
