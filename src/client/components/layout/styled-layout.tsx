import {DrawerToggleButton} from "./drawer-toggle-button";
import {makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import React, {useRef, useState} from "react";
import {Menu} from "./menu";
import {drawerWidth} from "../global-styles";
import { LanguageSelector } from "../language-selector";
import {AuthService} from "../../service/auth";


const useStyles = makeStyles( (theme: Theme) => {
    return {
        container: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
            height: "100%",
        },
        sidebar: {
            flex: 0,
            display: "none",
            paddingTop: "4px",
            paddingBottom: "4px",
            [theme.breakpoints.up("sm")] : {  //@media (min-width:600px)
                display: "flex"
            }
        },
        mobileSidebar: {
            flex: 0,
            display: "flex",
            position: "absolute",
            left: 0,
            paddingTop: "4px",
            paddingBottom: "4px",
            [theme.breakpoints.up("sm")] : {  //@media (min-width:600px)
                display: "none"
            },
            zIndex: 100,
        },

        header: {
            flex: 0,
            display: "flex",
            flexDirection: "row",
            maxHeight: "40px",
            minHeight: "40px",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            border: `1px solid ${theme.palette.divider}`,
        },
        headerLeft: {
            flex: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
        },
        headerMiddle: {
            flex: 1,
        },
        headerRight: {
            flex: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
        },
        body: {
            display: "flex",
            flexDirection: "row",
            flex: 1,
        },
        main: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 42px)",
        },
    };
}, {name: "layout"});

export interface IStyledLayoutProps {
    title: string;
    profileName?: string;
    children: any;
}

export const StyledLayout = (props: IStyledLayoutProps) => {

    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const headerRef = useRef<HTMLDivElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const handleLinkClick = () => {
        console.log("handleLinkClick")
        if(mobileOpen) {
            setMobileOpen(false);
        }
    };

    let jsxDrawerToggleButton;
    let jsxSidebar;
    let jsxMobileSidebar;
    let jsxMenu;
    if(AuthService.instance().isSignedIn()) {
        jsxDrawerToggleButton = (<DrawerToggleButton onClick={handleDrawerToggle} />);

        jsxMenu = (
            <Menu additionalClickEffect={handleLinkClick}/>
        );

        jsxSidebar = (
            <aside className={classes.sidebar}>
                {jsxMenu}
            </aside>
        );
        if(mobileOpen && headerRef && headerRef?.current) {
            const mobileSidebarHt = `calc(100% - ${headerRef.current.clientHeight}px)`;
            const mobileSidebarStyle = {
                top: headerRef.current.clientHeight,
                height: mobileSidebarHt,
            };
            jsxMobileSidebar = (
                <aside className={classes.mobileSidebar} style={mobileSidebarStyle}>
                    {jsxMenu}
                </aside>
            );
        }
    }

    return (
        <div className={classes.container} id={"layout-container"}>
            <Paper ref = {headerRef} className={classes.header} id={"paper"}>
                <div className={classes.headerLeft}>
                    {jsxDrawerToggleButton}
                    <Typography variant="h6" noWrap>
                        {props.title}
                    </Typography>
                </div>
                <div className={classes.headerMiddle}>
                </div>
                <div className={classes.headerRight} id={"profile-name"}>
                    <Typography variant="caption" noWrap>
                        {props.profileName}
                    </Typography>
                    <LanguageSelector />
                </div>
            </Paper>
            <div className={classes.body} id={"layout-body"}>
                {jsxSidebar}
                {jsxMobileSidebar}
                <main className={classes.main} id={"layout-main"}>
                    {props.children}
                </main>

            </div>

        </div>
    )
};
