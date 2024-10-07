import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, AccumulativeShadows, RandomizedLight } from "@react-three/drei";

import Shirt from "./Shirt";
import CameraRig from "./CameraRig";
import Backdrop from "./Backdrop";
import { useSnapshot } from "valtio";
import state from "../store";

const CanvasModel = () => {
  const snap = useSnapshot(state)
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2], fov: 25 }} // Adjust camera distance for better view
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full"
    >
      <Environment preset="sunset" />
      <Backdrop />
      <CameraRig>
        <mesh position={[0, 0.01, 0]}>
          <Shirt />
          <AccumulativeShadows temporal frames={100} alphaTest={0.95} opacity={1} scale={25} position={[0, -1, 0]}>
            <RandomizedLight amount={8} radius={10} ambient={0.7} position={[10, 10, -5]} bias={0.01} size={10} />
          </AccumulativeShadows>
        </mesh>
      </CameraRig>
      <OrbitControls makeDefault autoRotateSpeed={8} autoRotate={snap.preview}/>
    </Canvas>
  );
};

export default CanvasModel;
