import {IEvent} from "../../types/event";
import {useEffect} from "react";
import {IAuth} from "../../../shared/types/auth";
import {setAuth} from "../../state/auth";
import {useDispatch} from "react-redux";
import {NotificationService} from "../../service/notification";

export interface IAuthProviderProps {
    children: any;
}
export const AuthProvider = (props: IAuthProviderProps) => {
    const dispatch = useDispatch();
    const handleAuthChange = (auth: IAuth) => {
        dispatch(setAuth(auth));
    };

    useEffect( () => {
        const listenerId = NotificationService.instance().subscribe(IEvent.AUTH, undefined, handleAuthChange);
        console.log("AuthProvider listenerId = ", listenerId)
        return () => {
            NotificationService.instance().unsubscribe(IEvent.AUTH, undefined, listenerId);
        }
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}