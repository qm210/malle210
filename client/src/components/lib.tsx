import styled from "@emotion/styled";

export const FullRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const FullColumn = styled(FullRow)`
  flex-direction: column;
`;
