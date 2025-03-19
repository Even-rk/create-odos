import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const use_app_dispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const use_app_selector: TypedUseSelectorHook<RootState> = useSelector;
