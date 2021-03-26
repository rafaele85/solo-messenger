import {StyledLayout} from "../layout/styled-layout";
import {Form, IFormField} from "../form/form2";
import {useState} from "react";
import { IMenuUrls } from "../../types/menu";
import { localization } from './../../service/localization';
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../state/root";

export const AddContact = () => {
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.ADDCONTACT, lang);
    
    const ttlTitle = t(ILocalizationResource.ADDCONTACT_TITLE)||"Добавить контакт";
    const ttlFormTitle = t(ILocalizationResource.ADDCONTACT_FORMTITLE)||"Добавление контакта";
    const ttlSearch = t(ILocalizationResource.FINDCONTACTBYNAME)||"Поиск по имени";
    const ttlAdd = t(ILocalizationResource.SUBMITBUTTON)||"Добавить";
    const ttlCancel = t(ILocalizationResource.CANCELBUTTON)||"Назад";

    const [query, setQuery] = useState<string>("");
    const [queryError, setQueryError] = useState<string>("");
    const [queryChanged, setQueryChanged] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const validateQuery = (v: string) => {
        return "";
    };

    const handleChangeQuery = (value: string) => {
        const err = validateQuery(value);
        setQuery(value);
        setQueryError(err);
        setQueryChanged(true);
        setError("");
    };

    const handleSubmit = async () => {
        let qErr = validateQuery(query);
        if(!qErr) {
            try {
                //
                return;
            } catch(err) {
                setError(err.error);
                qErr=err.query;
            }
        }
        setQueryError(qErr);
    };

    const submitDisabled = !!error || !!queryError;


    const queryField: IFormField = {
        name: "query",
        label: ttlSearch,
        value: query,
        onChange: handleChangeQuery,
        error: queryError,
        changed: queryChanged,
    };

    return (
        <StyledLayout title={ttlTitle}>
            <Form title={ttlFormTitle}
                  fields={[queryField]}
                  cancelLabel={ttlCancel}
                  cancelUrl={IMenuUrls.HOME}
                  submitLabel={ttlAdd}
                  onSubmit={handleSubmit}
                  submitDisabled={submitDisabled}
            />
        </StyledLayout>
    );
}
