import "../App.css";
import { DbContext } from "../DbProvider";
import { useAppSelector } from "../redux/store";
import { useContext } from "react";

function DisplayInfo() {
    const { latestRing } = useContext(DbContext);

    const updateTime  = useAppSelector((state) => state.updateTime.value);

    return (
        <>
            <div className="time-info">
                <div>リング数: {latestRing?.ringCount ?? "不明"}</div>
                <div className="last-update">最終更新日時: {updateTime || "不明" }</div>
                <div>最終更新場所: {latestRing?.locationJp ?? "不明"}</div>
            </div>
        </>
    )
}
export default DisplayInfo;