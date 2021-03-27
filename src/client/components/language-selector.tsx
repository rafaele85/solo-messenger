import { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../state/root';
import { NotificationService } from './../service/notification';
import { IEvent } from '../../shared/types/event';
import { defaultLanguage } from '../../shared/types/language';
import { makeStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) => {
    return {
        select: {
            background: theme.palette.divider,
        }
    }
});

export const LanguageSelector = () => {
    const lang = useSelector(selectLanguage) || defaultLanguage();

    const classes = useStyle();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        NotificationService.instance().notify(IEvent.LANGUAGE, undefined, lang);
    };

    return (
        <select onChange = {handleChange} value={lang} className={classes.select}>
            <option value="ru" key="ru" >Rus</option>
            <option value="en" key="en" >En</option>
        </select>
    )
}