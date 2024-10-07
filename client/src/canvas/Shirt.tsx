import * as THREE from "three";
import { useSnapshot } from "valtio";
import { Decal, useGLTF, useTexture, PivotControls } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import state from "../store";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    [x: string]: THREE.Mesh;
  };
  materials: {
    lambert1: THREE.MeshStandardMaterial;
  };
};

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes } = useGLTF("/shirt_baked.glb") as GLTFResult;
  const material = new MeshStandardMaterial({ color: snap.color });
  const logoTexture = useTexture(snap.logoDecal);
  const leftShoulderTexture = useTexture(snap.leftShoulderDecal);
  const rightShoulderTexture = useTexture(snap.rightShoulderDecal);
  const backTexture = useTexture(snap.backDecal);

  const fullTexture = useTexture(snap.fullDecal);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [pos, setXYZ] = useState<[number, number, number]>([0, 0.04, 0.15]);
  const [rot, setRot] = useState<[number, number, number]>([0, 0, 0]);
  const [scl, setScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  const [leftpos, setLeftXYZ] = useState<[number, number, number]>([-0.28, 0.1, -0.02]);
  const [leftrot, setLeftRot] = useState<[number, number, number]>([0, 0, 0]);
  const [leftscl, setLeftScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  const [rightpos, setRightXYZ] = useState<[number, number, number]>([0.27, 0.1, -0.01]);
  const [rightrot, setRightRot] = useState<[number, number, number]>([0, 0, 0]);
  const [rightscl, setRightScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  const [backpos, setBackXYZ] = useState<[number, number, number]>([0, 0.06, -0.1]);
  const [backrot, setBackRot] = useState<[number, number, number]>([0, 0, 0]);
  const [backscl, setBackScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  useFrame(() => {
    if (snap.preview) {
      console.log("start rotation.......");
      nodes.T_Shirt_male.rotation.y += 0.01; // Adjust the rotation speed as needed
    }
  });

  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={material}
      material-roughness={1}
      dispose={null}
      material-aoMapIntensity={1}
      scale={isMobile ? 0.76 : 0.9}
    >
      {snap.isFullTexture && (
        <Decal
          position={[0, 0, 0]} // Centered on the shirt
          rotation={[0, 0, 0]}
          scale={isMobile ? 1 : 1}
          map={fullTexture}
          polygonOffsetFactor={-1}
        />
      )}

      {snap.isLogoTexture && (
        <>
          {!snap.preview && (
            <group position={[0.02, 0.03, 0.2]}>
              <PivotControls
                scale={0.1}
                activeAxes={[true, true, false]}
                onDrag={(local) => {
                  const position = new THREE.Vector3();
                  const scale = new THREE.Vector3();
                  const quaternion = new THREE.Quaternion();
                  local.decompose(position, quaternion, scale);
                  const rotation = new THREE.Euler().setFromQuaternion(quaternion);
                  setXYZ([position.x, position.y, 0.1]);
                  setRot([rotation.x, rotation.y, rotation.z]);
                  setScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z]);
                }}
              />
            </group>
          )}
          <Decal
            position={pos} // Use state for logo position
            rotation={rot} // No rotation for simplicity
            scale={scl} // Use state for logo scaling
            map={logoTexture}
            polygonOffsetFactor={-1}
            material-depthTest={true}
          />
        </>
      )}

      {snap.isLeftShoulderLogo && (
        <>
          {!state.preview && (
            <group position={[-0.3, 0.08, -0.02]} rotation={[0, -Math.PI / 2, 0]}>
              <PivotControls
                scale={0.1}
                activeAxes={[true, true, false]}
                onDrag={(local) => {
                  const position = new THREE.Vector3();
                  const scale = new THREE.Vector3();
                  const quaternion = new THREE.Quaternion();
                  local.decompose(position, quaternion, scale);
                  const rotation = new THREE.Euler().setFromQuaternion(quaternion);
                  setLeftXYZ([position.x, position.y, -0.02]);
                  setLeftRot([rotation.x, rotation.y, rotation.z]);
                  setLeftScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z]);
                }}
              />
            </group>
          )}
          <Decal
            position={leftpos}
            rotation={leftrot}
            scale={leftscl}
            // position={isMobile ? [-0.27, 0.11, -0.02] : [-0.28, 0.1, -0.02]} // Final left shoulder position
            // rotation={[0, 0, Math.PI / 2]} // Adjust rotation to align with shoulder
            // scale={isMobile ? 0.05 : 0.07} // Adjust scale as necessary
            map={leftShoulderTexture} // Logo texture
            polygonOffsetFactor={-1}
          />
        </>
      )}

      {snap.isRightShoulderLogo && (
        <>
          {!snap.preview && (
            <group position={[0.3, 0.08, -0.02]} rotation={[0, Math.PI / 2, 0]}>
              <PivotControls
                scale={0.1}
                activeAxes={[true, true, false]}
                onDrag={(local) => {
                  const position = new THREE.Vector3();
                  const scale = new THREE.Vector3();
                  const quaternion = new THREE.Quaternion();
                  local.decompose(position, quaternion, scale);
                  const rotation = new THREE.Euler().setFromQuaternion(quaternion);
                  setRightXYZ([position.x, position.y, -0.06]);
                  setRightRot([rotation.x, rotation.y, rotation.z]);
                  setRightScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z]);
                }}
              />
            </group>
          )}
          <Decal
            position={rightpos}
            rotation={rightrot}
            scale={rightscl}
            // position={isMobile ? [0.27, 0.1, -0.03] : [0.27, 0.1, -0.03]} // Final right shoulder position
            // rotation={[0, 0, -Math.PI / 2]} // Adjust rotation to align with shoulder
            // scale={isMobile ? 0.05 : 0.07} // Adjust scale as necessary
            map={rightShoulderTexture} // Logo texture
            polygonOffsetFactor={-1}
          />
        </>
      )}

      {snap.isBackLogo && (
        <>
          {!snap.preview && (
            <group position={[0.02, 0.03, -0.2]}>
              <PivotControls
                scale={0.1}
                activeAxes={[true, true, false]}
                onDrag={(local) => {
                  const position = new THREE.Vector3();
                  const scale = new THREE.Vector3();
                  const quaternion = new THREE.Quaternion();
                  local.decompose(position, quaternion, scale);
                  const rotation = new THREE.Euler().setFromQuaternion(quaternion);
                  setBackXYZ([position.x, position.y, -0.1]);
                  setBackRot([rotation.x, rotation.y, rotation.z]);
                  setBackScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z]);
                }}
              />
            </group>
          )}
          <Decal
            position={backpos}
            rotation={backrot}
            scale={backscl}
            // position={[0, 0.06, -0.1]}
            // rotation={[0, Math.PI, 0]}
            // scale={0.15}
            map={backTexture}
            polygonOffsetFactor={-1}
          />
        </>
      )}
    </mesh>
  );
};

export default Shirt;
