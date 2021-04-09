import {IconButton, makeStyles, Theme} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useDrawerToggleButtonStyles = makeStyles((theme: Theme) => {
    return {
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up("sm")]: {
                display: "none"
            }
        },
    }
}, {name: "drawer-toggle-button"});


/**
 * Props for DrawerTogglerButotn
 */
export interface IDrawerToggleButtonProps {
    /**
     * Callback to call when user clicks on the drawer toggle button
     */
    onClick: () => void;
}


/**
 * Button to toggle drawer on and off (show / hide drawer)
 * Only shown if screen resolution is less than "sm" breakpoint
 * @param props props for the component (see IDrawerToggleButtonProps)
 * @constructor
 */
export const DrawerToggleButton = (props: IDrawerToggleButtonProps) => {
    const classes = useDrawerToggleButtonStyles();
    return (
        <IconButton
            color="inherit"
            aria-label="open-drawer"
            edge='start'
            onClick={props.onClick}
            className={classes.menuButton}
        >
            <MenuIcon/>
        </IconButton>
    );
};