import React from "react";
import styled from '@emotion/styled';

import ControlBar from "../components/ControlBar";
import {Outlet} from "@tanstack/react-router";
import ConnectionOverlay from "../components/ConnectionOverlay.tsx";

const AppLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  
  & > div:first-of-type {
    flex: 1;
  }
  
  & > div:nth-of-type(2) {
    flex-basis: 100px;
  }
`;

const App = () => {
    return (
        <AppLayout>
            <Outlet/>
            <ControlBar/>
            <ConnectionOverlay/>
        </AppLayout>
    );
};

export default App;
