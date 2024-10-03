import { useSnapshot } from "valtio";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { useMediaQuery } from "react-responsive";
import React, { useState, useEffect } from "react";
import state from "../store";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ThreeEvent } from "@react-three/fiber";

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

  // Function to handle dragging the logo
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    const initialX = event.point.x;
    const initialY = event.point.y;

    const handlePointerMove = (moveEvent: ThreeEvent<PointerEvent>) => {
      const newX = moveEvent.point.x;
      const newY = moveEvent.point.y;

      // Calculate new position ensuring it stays within the fixed area
      const xPosition = Math.max(fixedArea.xMin, Math.min(fixedArea.xMax, logoPosition[0] + (newX - initialX)));
      const yPosition = Math.max(fixedArea.yMin, Math.min(fixedArea.yMax, logoPosition[1] + (newY - initialY)));

      setLogoPosition([xPosition, yPosition, logoPosition[2]]);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
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
    <group>
      <mesh castShadow geometry={nodes.T_Shirt_male.geometry} material={material} material-roughness={1} dispose={null}>
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
          <Decal
            position={logoPosition} // Use state for logo position
            rotation={[0, 0, 0]} // No rotation for simplicity
            scale={[logoScale, logoScale, 1]} // Use state for logo scaling
            map={logoTexture}
            onPointerDown={handlePointerDown} // Enable dragging
            polygonOffsetFactor={-1}
          />
        )}

        {/* Other logos on the shirt */}
        {snap.isLogoTexture && (
          <>
            {snap.isLeftShoulderLogo && (
              <Decal
                position={isMobile ? [-0.27, 0.11, -0.02] : [-0.28, 0.1, -0.02]}
                rotation={[0, 0, Math.PI / 2]}
                scale={[shoulderLogoScale, shoulderLogoScale, 1]} // Use state for shoulder logo scaling
                map={logoTexture}
                polygonOffsetFactor={-1}
              />
            )}

            {snap.isRightShoulderLogo && (
              <Decal
                position={isMobile ? [0.27, 0.1, -0.03] : [0.28, 0.1, -0.02]}
                rotation={[0, 0, Math.PI / 2]}
                scale={[shoulderLogoScale, shoulderLogoScale, 1]} // Use state for shoulder logo scaling
                map={logoTexture}
                polygonOffsetFactor={-1}
              />
            )}

            {snap.isBackLogo && (
              <Decal position={[0, 0.06, -0.1]} rotation={[0, Math.PI, 0]} scale={0.15} map={logoTexture} />
            )}
          </>
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
