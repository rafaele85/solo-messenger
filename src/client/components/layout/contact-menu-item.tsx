import {IContact} from "../../../shared/types/contact";
import {makeStyles, Theme} from "@material-ui/core";



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


/**
 *  Props for ContactMenuItem
 */
export interface IContactMenuItemProps {
    /**
     * contact object to show in the menu
     */
    contact: IContact;

    /**
     * callback to call when user clicks on one of the contacts
     */
    onSelect: () => void;
}

/**
 * A menu item representing one of user's friends in the contact list.
 * Shows contact's name as menu label on the screen
 * @param props see IContactMenuItemProps
 * @constructor
 */
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