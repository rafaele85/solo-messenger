import styled from "styled-components";
import {DrawerToggleButton} from "./drawer-toggle-button";
import {makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import {selectAuth, selectProfile} from "../../state/root";
import {useRef, useState} from "react";
import {Menu} from "./menu";
import {drawerWidth} from "../global-styles";


const useStyles = makeStyles( (theme: Theme) => {
    const dw = drawerWidth();
    return {
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
        container: {
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
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
        body: {
            display: "flex",
            flexDirection: "row",
        },
        main: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            justifyContent: "center",
            alignItems: "center",
        },
    };
});

export interface IStyledLayoutProps {
    title: string;
    children: any;
}

export const StyledLayout = (props: IStyledLayoutProps) => {

    const classes = useStyles();

    const auth = useSelector(selectAuth);

    const profile = useSelector(selectProfile);

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
    if(auth) {
        jsxDrawerToggleButton = (<DrawerToggleButton onClick={handleDrawerToggle} />);

        jsxMenu = (
            <Menu additionalClickEffect={handleLinkClick}/>
        );

        jsxSidebar = (
            <Sidebar className={classes.sidebar}>
                {jsxMenu}
            </Sidebar>
        );
        if(mobileOpen && headerRef && headerRef?.current) {
            const mobileSidebarHt = `calc(100% - ${headerRef.current.clientHeight}px)`;
            const mobileSidebarStyle = {
                top: headerRef.current.clientHeight,
                height: mobileSidebarHt,
            };
            jsxMobileSidebar = (
                <Sidebar className={classes.mobileSidebar} style={mobileSidebarStyle}>
                    {jsxMenu}
                </Sidebar>
            );
        }
    }

    return (
        <div className={classes.container}>
            <Paper ref = {headerRef} className={classes.header}>
                <div className={classes.headerLeft}>
                    {jsxDrawerToggleButton}
                    <Typography variant="h6" noWrap>
                        {props.title}
                    </Typography>
                </div>
                <Typography variant="caption" noWrap>
                    {auth && profile?.name}
                </Typography>
            </Paper>
            <Body className={classes.body}>
                {jsxSidebar}
                {jsxMobileSidebar}
                <main className={classes.main}>
                    {props.children}
                </main>

            </Body>

        </div>
    )
};


const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.aside`

`;


