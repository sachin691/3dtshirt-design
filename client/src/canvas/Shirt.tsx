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

  // State initialization with proper tuple types
  const [pos, setXYZ] = useState<[number, number, number]>([0, 0.04, 0.15]);
  const [rot, setRot] = useState<[number, number, number]>([0, 0, 0]);
  const [scl, setScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  // Left shoulder state
  const [leftpos, setLeftXYZ] = useState<[number, number, number]>([-0.28, 0.1, -0.02]);
  const [leftrot, setLeftRot] = useState<[number, number, number]>([0, 0, 0]);
  const [leftscl, setLeftScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  // Right shoulder state
  const [rightpos, setRightXYZ] = useState<[number, number, number]>([0.27, 0.1, -0.01]);
  const [rightrot, setRightRot] = useState<[number, number, number]>([0, 0, 0]);
  const [rightscl, setRightScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  // Back logo state
  const [backpos, setBackXYZ] = useState<[number, number, number]>([0, 0.06, -0.1]);
  const [backrot, setBackRot] = useState<[number, number, number]>([0, 0, 0]);
  const [backscl, setBackScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  useFrame(() => {
    if (snap.preview) {
      console.log("start rotation......."); // Optional: logging for debugging
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
                  setXYZ([position.x, position.y, 0.1] as [number, number, number]);
                  setRot([rotation.x, rotation.y, rotation.z] as [number, number, number]);
                  setScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z] as [number, number, number]);
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
                  setLeftXYZ([position.x, position.y, -0.02] as [number, number, number]);
                  setLeftRot([rotation.x, rotation.y, rotation.z] as [number, number, number]);
                  setLeftScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z] as [number, number, number]);
                }}
              />
            </group>
          )}
          <Decal
            position={leftpos}
            rotation={leftrot}
            scale={leftscl}
            map={leftShoulderTexture}
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
                  setRightXYZ([position.x, position.y, -0.06] as [number, number, number]);
                  setRightRot([rotation.x, rotation.y, rotation.z] as [number, number, number]);
                  setRightScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z] as [number, number, number]);
                }}
              />
            </group>
          )}
          <Decal
            position={rightpos}
            rotation={rightrot}
            scale={rightscl}
            map={rightShoulderTexture}
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
                  setBackXYZ([position.x, position.y, -0.1] as [number, number, number]);
                  setBackRot([rotation.x, rotation.y, rotation.z] as [number, number, number]);
                  setBackScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z] as [number, number, number]);
                }}
              />
            </group>
          )}
          <Decal position={backpos} rotation={backrot} scale={backscl} map={backTexture} polygonOffsetFactor={-1} />
        </>
      )}
    </mesh>
  );
};

export default Shirt;
  