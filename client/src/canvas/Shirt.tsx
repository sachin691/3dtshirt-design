import * as THREE from "three";
import { useSnapshot } from "valtio";
import { Decal, useGLTF, useTexture, PivotControls } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import state from "../store";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { rotate } from "maath/dist/declarations/src/buffer";

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
  const fullTexture = useTexture(snap.fullDecal);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [pos, setXYZ] = useState<[number, number, number]>([0, 0.04, 0.15]);
  const [rot, setRot] = useState<[number, number, number]>([0, 0, 0]);
  const [scl, setScl] = useState<[number, number, number]>([0.1, 0.1, 0.1]);

  // State for logo scaling and position
  const [logoPosition, setLogoPosition] = useState<[number, number, number]>([0, 0.04, 0.15]); // Default position for the logo
  const [logoScale, setLogoScale] = useState(0.15); // Default scale
  const [shoulderLogoScale, setShoulderLogoScale] = useState(isMobile ? 0.2 : 0.3); // Shoulder logo scale

  // Fixed area dimensions for the chest logo
  const fixedArea = {
    xMin: -0.1,
    xMax: 0.1,
    yMin: 0.01,
    yMax: 0.2,
  };

  // Function to handle resizing the logo
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault(); // Prevent scrolling the page
    const scaleChange = event.deltaY > 0 ? -0.01 : 0.01; // Adjust for scroll direction
    setLogoScale((prevScale) => Math.min(Math.max(prevScale + scaleChange, 0.05), 0.3)); // Adjust min and max scale
  };

  // Effect to add event listener for wheel events
  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={material}
      material-roughness={1}
      dispose={null}
      material-aoMapIntensity={1}
      scale={0.72}
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
                setXYZ([position.x, position.y, 0.1]);
                setRot([rotation.x, rotation.y, rotation.z]);
                setScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z]);
              }}
            />
          </group>
          <Decal
            position={isMobile ? [-0.27, 0.11, -0.02] : [-0.28, 0.1, -0.02]} // Final left shoulder position
            rotation={[0, 0, Math.PI / 2]} // Adjust rotation to align with shoulder
            scale={isMobile ? 0.05 : 0.07} // Adjust scale as necessary
            map={logoTexture} // Logo texture
            polygonOffsetFactor={-1}
          />
        </>
      )}

      {snap.isRightShoulderLogo && (
        <>
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
                setXYZ([position.x, position.y, 0.1]);
                setRot([rotation.x, rotation.y, rotation.z]);
                setScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z]);
              }}
            />
          </group>
          <Decal
            position={isMobile ? [0.27, 0.1, -0.03] : [0.27, 0.1, -0.03]} // Final right shoulder position
            rotation={[0, 0, -Math.PI / 2]} // Adjust rotation to align with shoulder
            scale={isMobile ? 0.05 : 0.07} // Adjust scale as necessary
            map={logoTexture} // Logo texture
            polygonOffsetFactor={-1}
          />
        </>
      )}

      {snap.isBackLogo && (
        <>
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
                setXYZ([position.x, position.y, 0.1]);
                setRot([rotation.x, rotation.y, rotation.z]);
                setScl([0.1 * scale.x, 0.1 * scale.y, 0.1 * scale.z]);
              }}
            />
          </group>
          <Decal
            position={[0, 0.06, -0.1]}
            rotation={[0, Math.PI, 0]}
            scale={0.15}
            map={logoTexture}
            polygonOffsetFactor={-1}
          />
        </>
      )}
    </mesh>
  );
};

export default Shirt;
