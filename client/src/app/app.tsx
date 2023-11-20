import React from "react";
import styled from '@emotion/styled';

import ControlBar from "../components/ControlBar";
import {Outlet} from "@tanstack/react-router";

const AppLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  
  & > div:first-of-type {
    flex: 1;
  }
  
  & > div:last-of-type {
    flex-basis: 100px;
  }
`;

const App = () => {
    return (
        <AppLayout>
            <Outlet/>
            <ControlBar/>
        </AppLayout>
    );
};

export default App;
