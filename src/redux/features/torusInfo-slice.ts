import { createSlice } from "@reduxjs/toolkit";

export type TorusInfo = {
    id:        number;
    color:     number, 
    rotateX:   number, 
    rotateY:   number,
    positionX: number,
    positionY: number,
    scale:     number,
}

const torusStore: TorusInfo[] = [];

export const torusInfo = createSlice({
    name: "torusDetails",
    initialState: torusStore,
    reducers: {
        pushTorusInfo: ((state, action) => { state.push(action.payload) }),
        resetHandle: () => { 
            console.log("resetしました");
            return torusStore;
        },
    },
});

export const { pushTorusInfo, resetHandle } = torusInfo.actions;
export default torusInfo.reducer;