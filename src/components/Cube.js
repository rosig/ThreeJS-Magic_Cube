import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

// cinza, azul, verde, amarelo, vermelho, laranja
const _colors = [
  "#757575",
  "#1565c0",
  "#388e3c",
  "#ffeb3b",
  "#dd2c00",
  "#fb8c00",
];

const Cube = (props) => {
  const [hovered, set] = useState();
  const previous = useRef();
  const attrib = useRef();
  const mesh = useRef();

  const object = useMemo(() => new THREE.Object3D(), []);
  const _color = useMemo(() => new THREE.Color(), []);

  useEffect(() => void (previous.current = hovered), [hovered]);

  const colors = useMemo(
    () =>
      new Array(27)
        .fill()
        .map(() => _colors[Math.floor(Math.random() * _colors.length)]),
    []
  );

  const colorArray = useMemo(() => {
    const color = new Float32Array(27 * 3);
    for (let i = 0; i < 27; i++) {
      _color.set(colors[i]);
      _color.toArray(color, i * 3);
    }
    return color;
  }, [colors, _color]);

  useFrame((state) => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;

    let i = 0;
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 3; y++)
        for (let z = 0; z < 3; z++) {
          const id = i++;
          object.position.set(x, y, z);
          object.updateMatrix();
          mesh.current.setMatrixAt(id, object.matrix);

          if (hovered !== previous.current) {
            _color.set(id === hovered ? "white" : colors[id]);
            _color.toArray(colorArray, id * 3);
            attrib.current.needsUpdate = true;
          }
        }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, 1000]}
      scale={[1.5, 1.5, 1.5]}
      onPointerMove={(e) => set(e.instanceId)}
      onPointerOut={(e) => set(undefined)}
    >
      <boxBufferGeometry attach="geometry" args={[0.9, 0.9, 0.9]}>
        <instancedBufferAttribute
          ref={attrib}
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
};

export default Cube;
