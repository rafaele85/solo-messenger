import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../state/root';
import { setLanguage } from './../state/language';
import { NotificationService } from './../service/notification';
import { IEvent } from '../types/event';
import { defaultLanguage } from '../../shared/types/language';

export const LanguageSelector = () => {
    const lang = useSelector(selectLanguage) || defaultLanguage();

    const dispatch = useDispatch();
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        NotificationService.instance().notify(IEvent.LANGUAGE, undefined, lang);
    };

    return (
        <select onChange = {handleChange} value={lang}>
            <option value="ru" key="ru" >Rus</option>
            <option value="en" key="en" >En</option>
        </select>
    )
}