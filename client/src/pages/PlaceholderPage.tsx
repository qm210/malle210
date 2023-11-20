import styled from "@emotion/styled";


const PlaceholderPage = () =>
    <PlaceholderPageStyle>

    </PlaceholderPageStyle>;

export default PlaceholderPage;


const PlaceholderPageStyle = styled.div`
  font-size: 100pt;
  white-space: nowrap;
  border: 2px solid black;
  box-sizing: border-box;
  
  display: flex;
  flex-direction: row;
  place-items: center;
  width: 100%;
  height: 100%;
`;
