import { TorusInfo } from "./redux/features/torusInfo-slice";
import { v4 as uuidv4 } from 'uuid';
import { Ring, positionArray, torusScale } from "./torusPosition";


/* 型定義 */
// リングの型
export type RingData = {
    "location": string; // 撮影場所
    "locationJp": string; // 撮影場所日本語
    "latitude": number; // 撮影地点の緯度
    "longitude": number; // 撮影地点の経度
    "userIp": string; // IPアドレス
    "ringCount": number; // リング数
    "orbitIndex": number; // リング軌道内の順番(DEI中の何個目か、0~70)
    "ringHue": number; // リングの色調(0～360)
    "creationDate":  number // 撮影日時
};
export type RingsData = {
    [id: string]: RingData;
};


/* 関数定義 */
// RingData型をTorusInfo型に変換する関数
export function convertToTorus(data: RingData): TorusInfo{
    const newRingPosition: Ring = positionArray[data.orbitIndex]; // リングの軌道設定
    const newTorusInfo: TorusInfo = {
        id: uuidv4(),
        color: `hsl(${data.ringHue}, 100%, 50%)`,
        rotateX: newRingPosition.rotateX,
        rotateY: newRingPosition.rotateY,
        positionX: newRingPosition.positionX,
        positionY: newRingPosition.positionY,
        scale: torusScale
    };
    return newTorusInfo;
}

// 全データの中から、直前に追加されたリングのデータを取得する関数
export function getLatestRing(data: RingsData): RingData | null{
    let latestRing: RingData | null = null;
    Object.values(data).forEach((value) => {
        if((latestRing === null) || (value.ringCount > latestRing.ringCount)){
            latestRing = value;
        }
    });
    return latestRing;
}