import React, { JSX } from 'react';
import { createBrowserHistory } from '../../../libs/history';
import { Router } from "../../../libs/react-router";

export default function BrowserRouter({children}: {children?: JSX.Element}){
    const history = createBrowserHistory()
    return <Router history={history}>{children}</Router>
}