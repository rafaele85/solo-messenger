import {StyledLayout} from "../layout/styled-layout";
import {Form, IFormField} from "../form/form2";
import {useState} from "react";

export const AddContact = () => {
    const ttlTitle = "Добавить контакт";
    const ttlFormTitle = "Добавление контакта";
    const ttlSearch="Поиск по имени";
    const ttlAdd = "Добавить";
    const ttlCancel = "Назад";

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
                  cancelUrl={"/"}
                  submitLabel={ttlAdd}
                  onSubmit={handleSubmit}
                  submitDisabled={submitDisabled}
            />
        </StyledLayout>
    );
}
