import { createContext, useState, ReactNode, useEffect } from 'react';
import {
    RingData,
    RingsData,
    getLatestRing
} from "./handleRingData";
import { getRingData } from ".//fetchDb";


/* 型定義 */
// contextに渡すデータの型
type DbContent = {
    ringsData: RingsData;
    latestRing: RingData | null;
    initializeRingData: (location?: string) => Promise<void>;
};


/* Provider */
const initialData: DbContent = {
    ringsData: {},
    latestRing: null,
    initializeRingData: () => Promise.resolve()
};

export const DbContext = createContext<DbContent>(initialData);

export function DbProvider({children}: {children: ReactNode}){
    // リングのデータを管理する
    const [ringsData, setRingsData] = useState<RingsData>({}); // サーバーから取得したリングデータ
    const [latestRing, setLatestRing] = useState<RingData | null>(null); // 直前に追加されたリングデータ

    // 一定時間おきにサーバーからデータを取得し、リング表示を初期化する
    useEffect(() => {
        initializeRingData();
        // const intervalTime: number = 1000 * 60 * 1; // 1分置きに更新する
        const intervalTime: number = 1000; // 1000ミリ秒でも負荷大丈夫そう
        const intervalFunc = setInterval(() => {
            initializeRingData();
            console.log("リングデータを更新しました")
        }, intervalTime);
        return () => clearInterval(intervalFunc);
    }, []);

    // リングのデータを、サーバーから取得したデータで初期化する関数
    async function initializeRingData(): Promise<void>{
        const newRingsData: RingsData = await getRingData() ?? {};
        const newLatestRing: RingData | null = getLatestRing(newRingsData);
        setRingsData(newRingsData);
        setLatestRing(newLatestRing);

        // TODO 後で消す
        console.log(
            "サーバーからデータを取得しました:\n", newRingsData,
            "\nリング数:", Object.keys(newRingsData).length
        );
        console.log("最新のリング:\n", newLatestRing);
    }

    return (
        <DbContext.Provider
            value={{
                ringsData,
                latestRing,
                initializeRingData
            }}
        >
            {children}
        </DbContext.Provider>
    );
}