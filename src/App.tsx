import "./App.css";
import { Ring, positionArray } from "./torusPosition";
import { Canvas } from '@react-three/fiber';
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { pushTorusInfo, resetHandle } from "./redux/features/torusInfo-slice";
import { getCurrentTime } from "./redux/features/currentTime-slice";
import { getUpdateTime } from "./redux/features/updateTime-slice";
import { v4 as uuidv4 } from 'uuid';
import TorusList from './components/TorusList';
import DisplayInfo from "./components/DisplayInfo";


function App() {
  let torusScale     : number;
  let shufflePosition: Ring[];
  let randomPosition : Ring | undefined;
  let num = 0;

  const dispatch = useDispatch<AppDispatch>();

  //配列内をシャッフルする
  function shuffleArray(sourcceArray: Ring[]) {
    const array = sourcceArray.concat();
    const arrayLength = array.length;

    for (let i = arrayLength - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  }
  shufflePosition = shuffleArray(positionArray);


  //写真をとったら（仮clickアクション）
  function addTorus() { 
    console.log(num + 1);
    
    torusScale = 0.08;
    const color = `hsl(${Math.floor(Math.random() * 361)}, 100%, 50%)`;

    randomPosition = shufflePosition[num];

    if (num == 70) {
      console.log("reset");
      dispatch(resetHandle());
      shufflePosition = shuffleArray(positionArray);
      num = 0;
      randomPosition = shufflePosition[num];
    } 

    
    //リング情報をstoreへ送る
    dispatch(pushTorusInfo(
      {
        id:        uuidv4(),
        color:     color,
        rotateX:   randomPosition.rotateX,
        rotateY:   randomPosition.rotateY,
        positionX: randomPosition.positionX, 
        positionY: randomPosition.positionY,
        scale:     torusScale,
      }
    ));
    num++;
    

    //最終更新日時の情報をstoreへ送る
    const date         = new Date();
    const year         = date.getFullYear();
    const month        = date.getMonth() + 1;
    const day          = date.getDate();
    const hour         = date.getHours().toString().padStart(2, "0");
    const minute       = date.getMinutes().toString().padStart(2, "0");
    const second       = date.getSeconds().toString().padStart(2, "0");

    dispatch(getUpdateTime(`最終更新日時: ${year}年${month}月${day}日${hour}:${minute}:${second}`));
  };


  //現在時間をstoreへ送る
  setInterval(() => {
    const date         = new Date();
    const month        = date.getMonth() + 1;
    const day          = date.getDate();
    const hour         = date.getHours().toString().padStart(2, "0");
    const minute       = date.getMinutes().toString().padStart(2, "0");
    const second       = date.getSeconds().toString().padStart(2, "0");
    const dayOfTheWeek = date.getDay();
    const weekName     = ['日', '月', '火', '水', '木', '金', '土'];

    dispatch(getCurrentTime(`${month}/${day}(${weekName[dayOfTheWeek]}) ${hour}:${minute}:${second}`));
  }, 1000);


  return(
    <>
      <div className='canvas'>
        <Canvas camera={{ position: [0,0,10] }} >
          <color attach="background" args={[0xff000000]} /> {/*背景色*/}
          <TorusList />
        </Canvas>
        <button className="addBt" onClick={addTorus}>仮ボタン</button>  {/*仮*/}
        <DisplayInfo />
      </div>
    </>
  );
}
export default App;