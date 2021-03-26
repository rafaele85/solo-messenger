import {IEvent} from "../../types/event";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {NotificationService} from "../../service/notification";
import { ILanguage } from "../../../shared/types/language";
import { setLanguage } from "../../state/language";

export interface ILanguageProviderProps {
    children: any;
}
export const LanguageProvider = (props: ILanguageProviderProps) => {
    const dispatch = useDispatch();
    const handleLanguageChange = (language: ILanguage) => {
        console.log("dispatch(setLanguage", language)
        dispatch(setLanguage(language));
    };

    useEffect( () => {
        const listenerId = NotificationService.instance().subscribe(IEvent.LANGUAGE, undefined, handleLanguageChange);
        return () => {
            NotificationService.instance().unsubscribe(IEvent.LANGUAGE, undefined, listenerId);
        }
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}