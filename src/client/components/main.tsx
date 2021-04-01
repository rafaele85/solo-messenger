import {Route, Switch} from "react-router-dom";
import {NotFound} from "./pages/not-found";
import {SignIn} from "./pages/signin";
import {Home} from "./pages/home";
import {AddContact} from "./pages/add-contact";
import {makeStyles, Theme} from "@material-ui/core";
import {Chat} from "./pages/chat/chat";
import {Profile} from "./pages/profile";
import {ProfileProvider} from "./providers/profile-provider";
import {ContactsProvider} from "./providers/contacts-provider";
import {SignUp} from "./pages/signup";
import {IMenuUrls} from "../client-types/menu";
import {ID_TYPE} from "../../shared/types/id-type";
import {useEffect, useState} from "react";
import {NotificationService} from "../service/notification";
import {IEvent} from "../../shared/types/event";

const useStyles = makeStyles((_theme: Theme) => {
    return {
        container: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "100%",
        }
    }
})

export const Main = () => {

    const [session, setSession] = useState<ID_TYPE|undefined>();

    const refreshSession = (mounted: boolean) => {
        if(mounted) {
            const s = localStorage.getItem("session") || undefined;
            setSession(s);
        }
    }

    useEffect(() => {
        let mounted=true;

        refreshSession(mounted)
        const listenerId = NotificationService.instance().subscribe(IEvent.AUTH,
            undefined, () => refreshSession(mounted)
        );

        return () => {
            mounted=false;
            if(listenerId) {
                NotificationService.instance().unsubscribe(IEvent.AUTH, undefined, listenerId);
            }
        }
    }, []);

    const classes = useStyles();

    let jsxMain;
    if(session) {
        jsxMain = (
            <ProfileProvider>
                <ContactsProvider>
                    <div className={classes.container} id={"main"}>
                        <Switch>
                            <Route exact path={IMenuUrls.HOME}>
                                <Home />
                            </Route>
                            <Route exact path={IMenuUrls.PROFILE}>
                                <Profile />
                            </Route>
                            <Route exact path={IMenuUrls.ADDCONTACT}>
                                <AddContact />
                            </Route>
                            <Route path={`${IMenuUrls.CONTACT}/:id`}>
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
            <Switch>
                <Route exact path={IMenuUrls.SIGNUP}>
                    <SignUp />
                </Route>
                <Route path="*">
                    <SignIn />
                </Route>
            </Switch>
        );
    }
    return jsxMain;
}
