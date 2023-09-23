import React from "react";
import styled from "@emotion/styled";


const STEPS = 16;
const NOTES = 24;

const LivePattern = () => {
    return (
        <PatternField columns={STEPS} rows={NOTES}>
            {
                Array.from(Array(NOTES).keys()).map(n =>
                    <React.Fragment key={n}>
                        <div>
                            {n}!
                        </div>
                        {
                            Array.from(Array(STEPS).keys()).map(step =>
                                <div key={step}>
                                    [{step}]
                                </div>
                            )
                        }
                    </React.Fragment>
                )
            }
        </PatternField>
    );
};

export default LivePattern;

const PatternField = styled.div<{columns: number, rows: number}>`
  display: grid;
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  grid-template-columns: 2rem repeat(${props => props.columns}, 1fr);
`;
