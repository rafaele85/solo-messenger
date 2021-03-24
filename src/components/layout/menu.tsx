import {Divider, List, ListItem, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import React from "react";
import {AuthService} from "../../service/auth";
import {StyledListItem} from "../styled-list-item";
import {useSelector} from "react-redux";
import { selectContacts} from "../../state/root";
import AddIcon from "@material-ui/icons/AddCircleOutlined";
import {ContactMenuItem} from "./contact-menu-item";
import {IContact} from "../../types/contact";
import {useHistory, useParams} from "react-router";

const useStyles = makeStyles( (theme: Theme) => {
    return {
        toolbar: theme.mixins.toolbar,
        container: {
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexDirection: "column",
            width: "180px",
        },
        addIcon: {
            paddingRight: "4px",
        },
        mycontacthdr: {
            paddingLeft: `${theme.spacing(1)}px`
        }
    }
})

export interface IMenuProps {
    additionalClickEffect: () => void;
}

export const Menu = (props: IMenuProps) => {
    const classes = useStyles();

    const contacts = useSelector(selectContacts)||[];

    const history = useHistory();
    const params = useParams();
    console.log("~~~params=")  //params.id
    let currentMenuOption="/";
    if(history.location.pathname.indexOf("add-contact")>=0) {
        currentMenuOption="add-contact";
    } else if(history.location.pathname.indexOf("profile")>=0) {
        currentMenuOption="profile";
    }
    console.log(`currentMenuOpton=${currentMenuOption} location=`)

    const handleSignOut = async () => {
        try {
            await AuthService.instance().signOut();
        } catch(err) {
            console.error(err)
        }
    };

    const handleSelectContact = (c: IContact) => {
        history.push(`/contact/${c.id}`);
    };

    let jsxContacts: JSX.Element[] = [];
    for(let i=0; i<contacts.length; i++) {
        const c = contacts[i];
        const isSelected = (c.id === currentMenuOption);
        jsxContacts.push((
            <StyledListItem key={i}  to={`/contact/${c.id}`} onClick={props.additionalClickEffect} isSelected={isSelected}>
                <ContactMenuItem contact={c} onSelect={() => handleSelectContact(c)}/>
            </StyledListItem>
        ))
    }
    if(jsxContacts.length) {
        jsxContacts.unshift(<Divider />);
    }

    return (
        <Paper className={classes.container}>
            <Typography className={classes.mycontacthdr}>Мои Контакты</Typography>
            <Divider />
            {jsxContacts}
            <Divider />
            <List>
                <StyledListItem to="/add-contact"
                                isSelected={(currentMenuOption==="add-contact")}
                                onClick={props.additionalClickEffect}
                >
                    <AddIcon className={classes.addIcon} />
                    Добавить контакт
                </StyledListItem>
            </List>
            <Divider />
            <List>
                <StyledListItem to="/profile"
                                isSelected={(currentMenuOption==="profile")}
                                onClick={props.additionalClickEffect}
                >
                    Профайл
                </StyledListItem>
            </List>
            <Divider />
            <List>
                <StyledListItem onClick={handleSignOut}>
                    Выход
                </StyledListItem>
            </List>
        </Paper>
    )
};
