import { RingsData } from "./handleRingData";

/* 関数定義 */
// const apiDomain: string = "https://api.wawwd.net/api/"; // アプリケーションサーバーのドメイン
const apiDomain: string = "https://wawwdtestdb-default-rtdb.firebaseio.com/api/"; // 仮DBサーバーのドメイン

// GETリクエストを行う共通関数
async function makeGetRequest(apiEndpoint: string, queryParams?: string): Promise<Response>{
    try {
        const response = await fetch(apiDomain + apiEndpoint + (queryParams ?? ''));
        if(response.ok){
            return response;
        }else{
            // エラーレスポンスの場合はエラーハンドリングを行う
            throw new Error(`HTTPエラー: ${response.status}`);
        }
    }catch(error){
        // エラーハンドリング
        console.error('リクエストエラー:', error);
        throw error;
    }
}

// ピン一か所から、リングのデータを取得する関数
export async function getRingData(location?: string): Promise<RingsData> {
    // const apiEndpoint: string = "ring-data";
    const apiEndpoint: string = "ring-data.json"; // 仮エンドポイント
    let queryParams: string = "";
    if(location){
        // ピンが指定されている場合、その一か所からのみリングのデータを取得する
        queryParams = `?id=${location}`;
    }
    const response: Response = await makeGetRequest(apiEndpoint, queryParams);
    const result: RingsData = await response.json();
    return result;
}