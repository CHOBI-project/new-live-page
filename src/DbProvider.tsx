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

    // 初回レンダリング時、サーバーからデータを取得する
    useEffect(() => {
        initializeRingData();
    }, [])

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