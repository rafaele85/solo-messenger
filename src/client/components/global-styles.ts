import {createGlobalStyle} from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
     padding: 0;
     margin: 0;
     box-sizing: border-box;     
  };
  
  body {
    height: 100vh;
    max-height: 100%;
    width: 100%;
    display: flex;
  };
  
  #root {
    flex: 1;
    display: flex;
    height: 100%;
    max-height: 100%;
  };
  
`;

export const drawerWidth = () => {
    return 400;
}