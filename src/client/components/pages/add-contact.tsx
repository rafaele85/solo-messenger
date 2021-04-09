import {StyledLayout} from "../layout/styled-layout";
import {Form} from "../form/form2";
import {useEffect, useState} from "react";
import { IMenuUrls } from "../../client-types/menu";
import { localization } from '../../service/localization';
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../state/root";
import { IContactShort1 } from "../../../shared/types/contact";
import { ID_TYPE } from "../../../shared/types/id-type";
import { ContactService } from '../../service/contact';
import {InputField} from "../form/input-field";
import {ListField} from "../form/list-field";

/**
 * Form for searching and adding contacts to the contact list.
 * Features search field on the top and matching list below it and the Add button at the bottom of the list.
 * The list is refreshed automatically from the server as the user types in the contact name in the search field.
 * The user can select a contact from the matching list and click Add to add them to the contact list.
 * @constructor
 */
export const AddContact = () => {
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.ADDCONTACT, lang);
    
    const ttlTitle = t(ILocalizationResource.ADDCONTACT_TITLE)||"Добавить контакт";
    const ttlFormTitle = t(ILocalizationResource.ADDCONTACT_FORMTITLE)||"Добавление контакта";
    const ttlSearch = t(ILocalizationResource.FINDCONTACTBYNAME)||"Поиск по имени";
    const ttlAdd = t(ILocalizationResource.SUBMITBUTTON)||"Добавить";
    const ttlCancel = t(ILocalizationResource.CANCELBUTTON)||"Назад";
    const ttlSelectedContact = t(ILocalizationResource.CONTACTLIST)||"Результаты поиска";

    const [query, setQuery] = useState<string|undefined>("");
    const [queryError, setQueryError] = useState<string>("");
    const [queryChanged, setQueryChanged] = useState<boolean>(false);

    const [selectedContactId, setSelectedContactId] = useState<ID_TYPE|undefined>();
    const [selectedContactIdError, setSelectedContactIdError] = useState<string>("");
    const [selectedContactIdChanged, setSelectedContactIdChanged] = useState<boolean>(false);
    
    const [contactList, setContactList] = useState<IContactShort1[]>([]);

    const [error, setError] = useState<string>("");

    useEffect( () => {
        let mounted=true;
        if(!query || query.length<3) {
            setContactList([]);
            setSelectedContactId(undefined);
            setSelectedContactIdError(validateSelectedContactId(""));
            return;
        }
        const fetchData = async () => {
            try {
                const cl = await ContactService.instance().matchingList(query);
                console.log("fetchData cl=")
                console.dir(cl)
                setContactList(cl);
            } catch(err) {
                console.error(err);
                setError(err)
            }
        };
        if(mounted) {
            fetchData();
        }
        return () => {
            mounted=false;
        }

    }, [query]);


    const validateQuery = (v: string|undefined) => {
        if(!v || v.length<3) {
            return ILocalizationResource.ERROR_NAMELEN;
        }
        return "";
    };

    const validateSelectedContactId = (v: string|undefined) => {
        if(!v) {
            return ILocalizationResource.ERROR_CONTACTNOTSELECTED;
        }
        return "";
    };

    const handleChangeQuery = (value: string|undefined) => {
        const err = validateQuery(value);
        setQuery(value);
        setQueryError(err);
        setQueryChanged(true);
        setError("");
    };

    const handleChangeSelectedContactId = (value: string|undefined) => {
        const err = validateSelectedContactId(value);
        setSelectedContactId(value);
        setSelectedContactIdError(err);
        setSelectedContactIdChanged(true);
        setError("");
    };

    const handleSubmit = async () => {
        let qErr = validateQuery(query);
        let sErr = validateSelectedContactId(selectedContactId||"");
        if(!qErr && !selectedContactIdError && selectedContactId) {
            try {
                await ContactService.instance().contactRequest(selectedContactId, "Please add me");
                setQuery("");
                return;
            } catch(err) {
                setError(err.error);
                qErr=err.query;
                sErr = err.selectedContactId;                
            }
        }
        setQueryError(qErr);
        setSelectedContactIdError(sErr);
    };

    const extractContactLabel = (c: IContactShort1) => c.name;
    const extractContactId = (c: IContactShort1) => c.id;

    const submitDisabled = !!error || !!queryError || !!selectedContactIdError;

    const queryErrorLocalized = t(queryError);


    return (
        <StyledLayout title={ttlTitle}>
            <Form title={ttlFormTitle}
                  cancelLabel={ttlCancel}
                  cancelUrl={IMenuUrls.HOME}
                  submitLabel={ttlAdd}
                  onSubmit={handleSubmit}
                  submitDisabled={submitDisabled}
            >
                <InputField
                    name="query"
                    label={ttlSearch}
                    value={query}
                    onChange={handleChangeQuery}
                    changed={queryChanged}
                    type={"text"}
                    autoFocus={true}
                    //error={queryErrorLocalized}
                />
                <ListField
                    name={"selectedContactId"}
                    label={ttlSelectedContact}
                    value={selectedContactId}
                    onChange={handleChangeSelectedContactId}
                    changed={selectedContactIdChanged}
                    listValues={contactList}
                    listLabelExtractor={extractContactLabel}
                    listValueExtractor={extractContactId}
                />
            </Form>
        </StyledLayout>
    );
}

