import * as THREE from "three";
import ReactDOM from "react-dom";
import React, { useRef, useCallback } from "react";
import { Canvas } from "react-three-fiber";
import Effects from "./components/Effects";
import "./index.css";
import Particles from "./components/Particles";
import Cube from "./components/Cube";

function App() {
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  return (
    <Canvas
      gl={{ antialias: false, alpha: false }}
      camera={{ position: [0, 0, 15], near: 5, far: 20 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.Uncharted2ToneMapping;
        gl.setClearColor(new THREE.Color("#020207"));
      }}
      onMouseMove={onMouseMove}
    >
      <ambientLight />
      <pointLight position={[150, 150, 150]} intensity={0.55} />
      <Cube position={[0, 0, 0]} />
      <Particles count={5000} mouse={mouse} />
      <Effects />
    </Canvas>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
