import styled from "@emotion/styled";
import {TailSpin} from "react-loader-spinner";
import React from "react";

export const FullRow = styled.div<{center?: boolean}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
  justify-content: ${props => props.center ? "center" : "stretch"};
  align-items: ${props => props.center ? "center" : "stretch"};
`;

export const FullColumn = styled(FullRow)`
  flex-direction: column;
`;

export const Loader = () =>
    <FullRow center>
        <TailSpin color={"white"}/>
    </FullRow>;
