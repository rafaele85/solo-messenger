import { makeStyles, Theme, Typography } from "@material-ui/core";
import { IMessage } from "../../../../shared/types/message";
import Avatar from "@material-ui/core/Avatar";
import { ID_TYPE } from "../../../../shared/types/id-type";

/**
 * Convert message timestamp into localized date/time string
 * @param d message timestamp
 * @return localized date/time string
 */
const formatMessageDate = (d: number) => {
    const dt = new Date(d);
    return dt?.toLocaleDateString();
}

const useStyles = makeStyles((theme: Theme) => {
    return {
        container: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            border: 0,
            padding: "10px",
            paddingRight: "20px",
        },
        left: {
            flex: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            paddingRight: "10px",
        },
        main: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            
        },
        top: {
            flex: 0,
            display: "flex",
            flexDirection: "row",
        },
        middle: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: theme.palette.divider,
            padding: "10px",
            borderRadius: "10px",        
        },
        sender: {

        },
        date: {

        },
        incoming: {
    
        },
        outgoing: {
    
        },
    }    
});

/**
 * Props for ChatMessage component
 */
export interface IChatMessageProps {
    /**
     * id of the contact who this message is from/to
     */
    selectedContactId: ID_TYPE;

    /**
     * message object
     */
    message: IMessage;
}

/**
 * Renders single chat message, including sender's Avatar, sender name, message text and date/time
 * If message is multi-line, renders each row in a separate <p> tag
 * @param props component props (see IChatMessageProps)
 * @constructor
 */
export const ChatMessage = (props: IChatMessageProps) => {
    const classes = useStyles();
    const jsxTextRows: JSX.Element[] = [];
    if(props.message?.message) {
        const ms = props.message.message.split("\n");
        for(let i=0; i<ms.length; i++) {
            const txt = ms[i];
            jsxTextRows.push((
                <p key={i}>{txt}</p>
            ));
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.left}>
                <Avatar />
            </div>
            <div className={classes.main}>
                <div className={classes.top}>
                    <Typography className={classes.sender}>
                        {props.message.from}
                    </Typography>
                    <Typography className={classes.date}>
                        {formatMessageDate(props.message.date)}
                    </Typography>
                </div>
                <div className={classes.middle}>
                    {jsxTextRows}
                </div>
            </div>
        </div>
    )
}