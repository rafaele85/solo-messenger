import { ID_TYPE } from "../../../../shared/types/id-type";
import { useSelector } from 'react-redux';
import { selectMessages } from "../../../state/root";
import {ChatMessage} from "./chat-message";
import { makeStyles, Theme } from "@material-ui/core";

export interface IChatMessagesProps {
    selectedContactId: ID_TYPE;
}

const useStyles = makeStyles((theme: Theme) => {
    return {
        main: {
            flex: 1,
            width: "100%",
            overflowY: "scroll",
        },
        
    }
})

export const ChatMessages = (props: IChatMessagesProps) => {
    const classes = useStyles();

    const messages = useSelector(selectMessages) || [];
 
    const jsxMessages: JSX.Element[] = [];
    for(let i=0; i<messages.length; i++) {
        const m = messages[i];
        jsxMessages.push((
            <ChatMessage message={m} selectedContactId={props.selectedContactId} />
        ));
    }

    return (
        <div className={classes.main}>
            {jsxMessages}
        </div>
    )
}