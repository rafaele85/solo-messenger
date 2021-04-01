import {useDispatch} from "react-redux";
import {useEffect} from "react";

export interface IProfileProviderProps {
    children: any;
}
export const ProfileProvider = (props: IProfileProviderProps) => {
    const dispatch = useDispatch();
    const handleProfileChange = async () => {
        /*
        try {
            const p = await AuthService.instance().profileGet();
            dispatch(setProfile(p));
        } catch(err) {
            console.error(err);
        }
         */
    };

    useEffect( () => {
        let mounted;
        /*
        const fetchData = async () => {
            try {
                await AuthService.instance().profileGet();
            } catch(err) {
                console.error(err);
            }
        };        
        const listenerId = NotificationService.instance().subscribe(IEvent.PROFILECHANGE, undefined, handleProfileChange);
        console.log("ProfileProvider listenerId = ", listenerId)
        if(mounted) {
            fetchData();
        }
        return () => {
            mounted=false;
            NotificationService.instance().unsubscribe(IEvent.PROFILECHANGE, undefined, listenerId);
        }
         */
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}