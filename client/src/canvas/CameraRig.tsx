import { useRef } from "react";
import { Group } from "three/src/Three.js";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const CameraRig = ({ children }: Props) => {
  const group = useRef() as React.MutableRefObject<Group>;
  return <group ref={group}>{children}</group>;
};

export default CameraRig;
