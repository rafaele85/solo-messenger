
import {ConfigureStoreOptions, configureStore, AnyAction} from "@reduxjs/toolkit";

import {IRootState, rootReducer} from "./root";

const options: ConfigureStoreOptions<IRootState, AnyAction, any> = {
    reducer: rootReducer,
    devTools: true
};


export const store = configureStore<IRootState, AnyAction>(options);

