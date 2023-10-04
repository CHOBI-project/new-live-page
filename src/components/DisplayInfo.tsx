import "../App.css";
import { DbContext } from "../DbProvider";
import { useAppSelector } from "../redux/store";
import { useEffect, useState, useContext } from "react";

function DisplayInfo() {
    const { latestRing } = useContext(DbContext);

    const currentTime = useAppSelector((state) => state.time.value);
    const updateTime  = useAppSelector((state) => state.updateTime.value);

    const [latLocation, setLatLocation] = useState<number>();
    const [lngLocation, setLngLocation] = useState<number>();
    
    // 現在位置を取得する
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat  = position.coords.latitude;
            let lng  = position.coords.longitude;
    
            setLatLocation(lat);
            setLngLocation(lng);
        });
    }, [latLocation, lngLocation]);

    
    return (
        <>
            <div className="top-container">
                <div className="camera-icon">
                    <img src="./src/assets/images/battery.svg" alt="battery" />
                    <img src="./src/assets/images/AF.svg"      alt="AF" />
                </div>

                <div className="live-icon">REC
                    <img src="./src/assets/images/live.svg" alt="rec-icon" />
                </div>
            </div>

            <div className="geo-info">
                <p>{latestRing?.locationJp ?? "不明"}</p> {/* 場所はここへ */}
                <p>Latitude &nbsp;&nbsp; : <span>{ latLocation }</span></p>
                <p>Longitude : <span>{ lngLocation }</span></p>
            </div>

            <div className="time-info">
                <div className="timer">現在時刻: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ currentTime }</div>
                { updateTime? <div className="last-update">{ updateTime }</div> : <div className="last-update">最終更新日時</div> }
            </div>
        </>
    )
}
export default DisplayInfo;