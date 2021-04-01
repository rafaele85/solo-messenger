import {IContact} from "../../../shared/types/contact";
import {makeStyles, Theme} from "@material-ui/core";

export interface IContactMenuItemProps {
    contact: IContact;
    onSelect: () => void;
}

const useStyles = makeStyles((theme: Theme) => {
    return {
        container: {
            display: "flex",
            flexDirection: "row",
        },
        unread: {
            color: "red"
        },
        nounread: {
            color: theme.palette.text.secondary
        }
    };
}, {name: "contact-menu-item"});


export const ContactMenuItem = (props: IContactMenuItemProps) => {
    const classes = useStyles();
    let cl;
    if(props.contact.unread) {
        cl = classes.unread;
    } else {
        cl = classes.nounread;
    }

    return (
        <div className={cl} onClick={props.onSelect}>
            {props.contact.name}
        </div>
    );
}