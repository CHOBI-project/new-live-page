import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import torusInfoSlice from "./features/torusInfo-slice";
import timerSlice from "./features/currentTime-slice";
import updateTimeSlice from "./features/updateTime-slice";

export const store = configureStore({
    reducer: {
        torusInfo : torusInfoSlice,
        time      : timerSlice,
        updateTime: updateTimeSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;