import {useHistory} from "react-router";
import {ListItem, makeStyles, Theme} from "@material-ui/core";

export interface IStyledListItemProps {
    children: any;
    to?: string;
    onClick?: () => void;
    isSelected?: boolean;
}

const useStyles = makeStyles((theme: Theme) => {
    return {
        container: {
            color: theme.palette.text.primary,
            backgroundColor: "tranparent",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
                background: theme.palette.background.default
            },
        },
        selected: {
            display: "flex",
            flexDirection: "row",
            color: theme.palette.text.primary,
            cursor: "pointer",
            alignItems: "center",
            "&:hover": {
                background: theme.palette.background.paper
            },
        }
    }
});


export const StyledListItem  = (props: IStyledListItemProps) => {
    const classes = useStyles();

    const history = useHistory();
    const onClick = () => {
        if(props.onClick) {
            props.onClick();
        }
        if(props.to) {
            history.push(props.to);
        }
    }
    let cl;
    if(props.isSelected) {
        cl=`${classes.container} ${classes.selected}`;
    } else {
        cl=classes.container;
    }
    return (
        <ListItem onClick={onClick} className={cl}>
            {props.children}
        </ListItem>
    )
}
