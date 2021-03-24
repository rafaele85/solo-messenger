import {useSelector} from "react-redux";
import {selectAuth} from "../state/root";
import {Route, Switch} from "react-router-dom";
import {NotFound} from "./pages/not-found";
import {SignIn} from "./pages/signin";
import React from "react";
import {Home} from "./pages/home";
import {AddContact} from "./pages/add-contact";
import {makeStyles, Theme} from "@material-ui/core";
import {Chat} from "./pages/chat";
import {Profile} from "./pages/profile";
import {ProfileProvider} from "./providers/profile-provider";
import {ContactsProvider} from "./providers/contacts-provider";

const useStyles = makeStyles((theme: Theme) => {
    return {
        container: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
        }
    }
})

export const Main = () => {

    const auth = useSelector(selectAuth);

    const classes = useStyles();

    let jsxMain;
    if(auth) {
        jsxMain = (
            <ProfileProvider>
                <ContactsProvider>
                    <div className={classes.container} id={"main"}>
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route exact path="/profile">
                                <Profile />
                            </Route>
                            <Route exact path="/add-contact">
                                <AddContact />
                            </Route>
                            <Route path="/contact/:id">
                                <Chat />
                            </Route>
                            <Route path="*">
                                <NotFound />
                            </Route>
                        </Switch>
                    </div>
                </ContactsProvider>
            </ProfileProvider>
        );
    } else {
        jsxMain = (
            <SignIn />
        );
    }
    return jsxMain;
}
