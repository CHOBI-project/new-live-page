import "./App.css";
import { useContext, useEffect } from "react";
import { positionArray } from "./torusPosition";
import { Canvas } from '@react-three/fiber';
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { TorusInfo, pushTorusInfo, resetHandle } from "./redux/features/torusInfo-slice";
import { getCurrentTime } from "./redux/features/currentTime-slice";
import { getUpdateTime } from "./redux/features/updateTime-slice";
import TorusList from './components/TorusList';
import DisplayInfo from "./components/DisplayInfo";
import { RingsData, convertToTorus } from "./handleRingData";
import { DbContext } from "./DbProvider";

// オブジェクトの最後のn個のリングデータを直接取得する関数(非推奨)
// TODO 仮定義なので、APIの方でリングデータが0～71個に限定されていることを確認次第、削除する
function getLastRings(obj: RingsData, lastAmount: number): RingsData{
  const keys: string[] = Object.keys(obj);
  const lastKeys: string[] = keys.slice(-lastAmount); // オブジェクトの最後のn個のキーを取得

  const result: RingsData = {};
  for (const key of lastKeys) {
    result[key] = obj[key]; // キーを使用してプロパティを抽出
  }

  return result;
}

// 過去周のDEI周を切り捨てる関数
// TODO 仮定義なので、APIの方でリングデータが0～71個に限定されていることを確認次第、削除する
function getLatestLap(data: RingsData): RingsData{
  const orbitLength: number = positionArray.length; // DEI一周に必要なリングの数
  const ringAmount: number = Object.keys(data).length; // リングデータの数
  let result: RingsData = {}; // 0～71個のリングデータ
  if(ringAmount <= orbitLength){
    // リングが0～71個の場合
    result = Object.assign({}, data);
  }else{
    // リングが71個より多い場合
    const latestLapLength: number = ringAmount % orbitLength; // 最新のDEI周が何個のリングでできているか
    if(latestLapLength === 0){
      // リング個数が71の倍数のとき
      result = getLastRings(data, 71);
    }else{
      result = getLastRings(data, latestLapLength);
    }
  }
  return result;
}

function App() {
  // サーバーから取得したリングデータを管理するcontext
  const {
    ringsData,
    latestRing
  } = useContext(DbContext);

  const dispatch = useDispatch<AppDispatch>();

    // リングの表示を行う
    useEffect(() => {
      initializeRingDraw();
    }, [ringsData]);

    // 最終更新日の表示を行う
    useEffect(() => {
      initializeLatestRing();
    }, [latestRing])
  
    // 現在のリングのデータ(ringsData)で、3Dオブジェクトを初期化する関数
    function initializeRingDraw(): void{
      dispatch(resetHandle()); // 全3Dを消去する

      const extractedRingData: RingsData = getLatestLap(ringsData); // リングデータを71個までに限定して切り出す(一応)

      // 3Dオブジェクトの初期表示を行う
      Object.values(extractedRingData).forEach((value) => {
        // リングデータを使用して、3Dオブジェクトを1つ作成する
        const newTorus: TorusInfo = convertToTorus(value);
        dispatch(pushTorusInfo(newTorus)); //リング情報をオブジェクトに詰め込みstoreへ送る
      });
    };

    // 最終更新日時の情報を初期化する関数
    function initializeLatestRing(): void{
      //最終更新日時の情報をstoreへ送る
      const date         = new Date(latestRing?.creationDate ?? 0);
      const year         = date.getFullYear();
      const month        = date.getMonth() + 1;
      const day          = date.getDate();
      const hour         = date.getHours().toString().padStart(2, "0");
      const minute       = date.getMinutes().toString().padStart(2, "0");
      const second       = date.getSeconds().toString().padStart(2, "0");

      dispatch(getUpdateTime(`${year}年${month}月${day}日${hour}:${minute}:${second}`));
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
    <div className='canvas'>
      <Canvas camera={{ position: [0,0,10] }} >
        <color attach="background" args={[0xff000000]} /> {/*背景色*/}
        <TorusList />
      </Canvas>
      <DisplayInfo />
    </div>
  );
}
export default App;