import { Vector3 } from "three";
import { useFrame } from "react-three-fiber";
import { useTexture } from "@react-three/drei";
import { useAppSelector } from "../redux/store";
import a from "../assets/images/a.jpg"; //波？
import b from "../assets/images/b.jpg"; //レンガ？
import c from "../assets/images/c.jpg"; //iphoneにありそうな画像？
import d from "../assets/images/d.jpg"; //三角形の画像？
import e from "../assets/images/e.jpg"; //フェンス？
import f from "../assets/images/f.jpg"; //？？？

function TorusList() {
  const torusList = useAppSelector((state) => state.torusInfo);
  const [ texture1, _texture2, _texture3, _texture4, _texture5, _texture6 ] = useTexture([a, b, c, d, e, f]); //textureのHooks複数指定


  //カメラのアップデート & レスポンシブサイズ
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const deviceWidth = window.innerWidth;
    
    if (deviceWidth >= 600 && deviceWidth <= 960) {
      state.camera.position.x = Math.cos(elapsedTime * 0.1) * 15;
      state.camera.position.y = 0;
      state.camera.position.z = Math.sin(elapsedTime * 0.1) * 15;
    } else if (deviceWidth >= 450 && deviceWidth <= 600) {
      state.camera.position.x = Math.cos(elapsedTime * 0.1) * 20;
      state.camera.position.y = 0;
      state.camera.position.z = Math.sin(elapsedTime * 0.1) * 20;
    } else if (deviceWidth <= 450) {
      state.camera.position.x = Math.cos(elapsedTime * 0.1) * 25;
      state.camera.position.y = 0;
      state.camera.position.z = Math.sin(elapsedTime * 0.1) * 25;
    } else {
      state.camera.position.x = Math.cos(elapsedTime * 0.1) * 12;
      state.camera.position.y = 0;
      state.camera.position.z = Math.sin(elapsedTime * 0.1) * 12;
    }
    state.camera.lookAt(new Vector3(0, 0, 0));
  });

  return (
    <>
        {torusList.map((torus) => (
          <mesh
            key={torus.id}
            position={[torus.positionX, torus.positionY, 0]}
            rotation={[torus.rotateX, torus.rotateY, 0]}
            scale={torus.scale}
          >
            <torusGeometry args={[5.5, 1.5, 8, 50]} />
            <meshBasicMaterial color={torus.color} map={texture1} />
          </mesh>
        ))}
    </>
  );
}
export default TorusList;