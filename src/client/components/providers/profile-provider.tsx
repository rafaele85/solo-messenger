import {useDispatch} from "react-redux";
import {setProfile} from "../../state/profile";
import {useEffect} from "react";
import {NotificationService} from "../../service/notification";
import {IEvent} from "../../types/event";
import {IProfile} from "../../types/profile";

export interface IProfileProviderProps {
    children: any;
}
export const ProfileProvider = (props: IProfileProviderProps) => {
    const dispatch = useDispatch();
    const handleProfileChange = (profile: IProfile) => {
        dispatch(setProfile(profile));
    };

    useEffect( () => {
        const listenerId = NotificationService.instance().subscribe(IEvent.PROFILE, undefined, handleProfileChange);
        console.log("ProfileProvider listenerId = ", listenerId)
        return () => {
            NotificationService.instance().unsubscribe(IEvent.PROFILE, undefined, listenerId);
        }
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}