import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import * as THREE from "three";

const smoothing = (g) => {
  const attNormal = g.getAttribute("normal");
  const numVerticesP = g.getAttribute("position").count;

  g.deleteAttribute("normal");

  const index = [];
  for (let i = 0; i < numVerticesP; i += 1) {
    index.push(i);
  }
  g.setIndex(index);

  const smooth = mergeVertices(g);
  smooth.setAttribute("normal", attNormal);
  smooth.computeVertexNormals();

  return smooth;
};

function createModelMesh(modelUrl, material, smooth, meshOpacity) {
  const loader = new STLLoader();
  console.log(modelUrl, material, smooth, meshOpacity);
  return new Promise((resolve, reject) => {
    loader.load(
      modelUrl,
      (geometry) => {
        // const mesh = new THREE.Mesh(
        //   smooth ? smoothing(geometry) : geometry,
        //   material
        // );
        const phongMat = new THREE.MeshPhysicalMaterial({
          transparent: true, // Enable transparency.
          opacity: meshOpacity, // Set opacity to 0.3, which is 70% transparent.
        });
        const mesh = new THREE.Mesh(
          smooth ? smoothing(geometry) : geometry,
          phongMat
        );
        resolve(mesh);
      },
      () => null,
      (error) => {
        reject(error);
      }
    );
  });
}

export default createModelMesh;
