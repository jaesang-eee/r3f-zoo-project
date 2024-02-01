import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environments } from "./components/Environments";
import { EditProvider } from "./context/EditContext";
import { Overlay } from "./components/overlay/Overlay";
import { KeyboardControls } from "@react-three/drei";
import { useMemo } from "react";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <KeyboardControls map={map}>
      <EditProvider>
        <Canvas
          shadows
          camera={{
            fov: 50,
            position: [160, 40, 150],
          }}
        >
          <Environments />
        </Canvas>
        <Overlay />
      </EditProvider>
    </KeyboardControls>
  );
}

export default App;
