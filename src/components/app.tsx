import React from "react";
import {createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {Main} from "./main";
import {GlobalStyle} from "./global-styles";
import {AuthProvider} from "./providers/auth-provider";
import {BrowserRouter} from "react-router-dom";

interface IAppProps {
}

export const App = (props: IAppProps) => {
    const theme = createMuiTheme({palette: {type: "dark"}});
    return (
        <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <BrowserRouter>
                    <CssBaseline />
                    <GlobalStyle />
                    <AuthProvider>
                        <Main />
                    </AuthProvider>
                </BrowserRouter>
            </StyledThemeProvider>
        </MuiThemeProvider>
    );
}


