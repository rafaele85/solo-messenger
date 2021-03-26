import {IconButton, makeStyles, Theme} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useDrawerToggleButtonStyles = makeStyles((theme: Theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
}));

export interface IDrawerToggleButtonProps {
    onClick: () => void;
}

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