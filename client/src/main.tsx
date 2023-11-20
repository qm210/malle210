import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import "./main.css";
import {RouterProvider} from "@tanstack/react-router";
import {IconContext} from "react-icons";
import router from "./app/router";
import MalleProvider from './infrastructure/malle-context';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <MalleProvider>
            <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                <RouterProvider router={router}/>
            </IconContext.Provider>
        </MalleProvider>
    </StrictMode>
);
