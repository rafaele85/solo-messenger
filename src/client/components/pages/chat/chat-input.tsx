import { localization } from '../../../service/localization';
import { ILocalizationCategory, ILocalizationResource } from "../../../../shared/types/localization";
import { IconButton, makeStyles, Theme } from '@material-ui/core';
import SendIcon from "@material-ui/icons/Send";
import { useSelector } from 'react-redux';
import { selectLanguage } from '../../../state/root';
import { useState, ChangeEvent, useRef, KeyboardEvent } from 'react';
import { ID_TYPE } from '../../../../shared/types/id-type';
import { MessageService } from '../../../service/message';


const useStyles = makeStyles((theme: Theme) => {
    return {
        bottom: {
            flex: 0,  
            width: "100%",          
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            
        },
        textarea: {
            display: "block",
            width: "100%",
            border: 0,
            background: "transparent",
            color: theme.palette.text.primary,
            outline: 0,
            resize: "none",
            overflow: "hidden",     
        }
    }
});

export interface IChatInputProps {
    selectedContactId: ID_TYPE;
};

export const ChatInput = (props: IChatInputProps) => {
    const classes=useStyles();
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.CHAT, lang);
    const ttlTypeMessage = t(ILocalizationResource.TYPEMESSAGE)||"Введите сообщение ";

    const [text, setText] = useState<string>("");
    
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const ref = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {        
        setTimeout(() => {
            const el = ref.current;            
            if(el) {
                console.log("handleKeydown")
                //el.style.height= 'auto';
                el.style.height = `${el.scrollHeight} px`;
            }            
          },0);
    };
    
    const handleSend = async () => {
        if(!text) {
            return;
        }
        try {
            await MessageService.instance().messageSend(text, props.selectedContactId);
            setText("");
        } catch(err) {
            console.error(err);
        }
    };

    let nrows = (text ? text.split("\n").length : 1);
    if(nrows===0) {
        nrows=1;
    } else if(nrows>10) {
        nrows=10;
    }

    return (
        <form className={classes.bottom}>
            <textarea 
                ref={ref}
                className={classes.textarea}
                placeholder={ttlTypeMessage}
                rows={nrows}
                autoFocus
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            >
            </textarea>
            <IconButton onClick={handleSend}>
                <SendIcon />
            </IconButton>
        </form>
    );
}
 
/*
            

*/