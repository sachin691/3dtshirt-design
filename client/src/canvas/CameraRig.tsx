import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { Group } from "three/src/Three.js";
import { ThreeEvent } from "@react-three/fiber"; // Import ThreeEvent type
import state from "../store";
import { useMediaQuery } from "react-responsive";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const CameraRig = ({ children }: Props) => {
  const snap = useSnapshot(state);
  const group = useRef() as React.MutableRefObject<Group>;

   const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
   const isBreakpoint = useMediaQuery({ query: "(max-width: 1024px)" });
  const mouseX = useRef(0);
  const touchX = useRef(0);
  const [isRotating, setIsRotating] = useState(false); // State to track if rotation is active
  const [lastRotationY, setLastRotationY] = useState(0); // Track last rotation position
  const isTouching = useRef(false);
  const startPosition = useRef(0); // Store initial position when starting rotation

  // Function to handle mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    if (isRotating) {
      mouseX.current = event.clientX;
    }
  };

  // Function to handle touch movement
  const handleTouchMove = (event: TouchEvent) => {
    if (isTouching.current && isRotating && event.touches.length > 0) {
      touchX.current = event.touches[0].clientX;
    }
  };

  // Function to handle mouse down
  const handleMouseDown = (event: ThreeEvent<PointerEvent>) => {
    startPosition.current = event.clientX; // Capture the initial position
    setIsRotating(true);
  };

  // Function to handle mouse up
  const handleMouseUp = () => {
    handleStopRotation();
  };

  // Function to handle touch start
  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      isTouching.current = true; // Set touching flag
      startPosition.current = event.touches[0].clientX; // Initialize start position
      touchX.current = event.touches[0].clientX; // Initialize touchX
      setIsRotating(true); // Start rotation on touch
    }
  };

  // Function to handle touch end
  const handleTouchEnd = () => {
    handleStopRotation();
    isTouching.current = false; // Reset touching flag
  };

  // Function to stop rotation when the user releases the button or touch
  const handleStopRotation = () => {
    setIsRotating(false);
    // Store the last rotation position when stopping
    setLastRotationY(group.current.rotation.y);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRotating]);

  useFrame((state, delta) => {
    let targetPosition: [number, number, number] = [-0.3, 0, 2];

    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0.2, 0.8];
      if (isMobile) targetPosition = [0, 0.1, 0.7];
    } else {
      if (isMobile) targetPosition = [0, 0, 1.8];
      else targetPosition = [0, 0, 1.5];
    }

    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // Rotate the group based on touch or mouse movement
    if (isRotating) {
      const rotationY = isTouching.current
        ? (touchX.current - startPosition.current) / 100 // Calculate rotation based on touch movement
        : (mouseX.current - startPosition.current) / 100; // Calculate rotation based on mouse movement
      group.current.rotation.y = lastRotationY + rotationY; // Start from the last position
    }
  });

  return (
    <group
      ref={group}
      onPointerDown={handleMouseDown} // Use mouse down to start checking for drag
      onDoubleClick={() => setIsRotating(true)} // Optional: allow double click to start rotation
    >
      {children}
    </group>
  );
};

export default CameraRig;
