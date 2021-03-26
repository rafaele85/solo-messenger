import React from 'react';
import ReactDOM from 'react-dom';
import {App} from "./client/components/app";
import {store} from "./client/state/store";
import {Provider} from "react-redux";

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);

