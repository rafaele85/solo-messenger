import {StyledLayout} from "../layout/styled-layout";
import {useState} from "react";
import {AuthService} from "../../service/auth";
import {Form, IFormField} from "../form/form2";
import {useHistory} from "react-router";

export const SignIn = () => {
    const ttlTitle = "Добро пожаловать в Chat";
    const ttlFormTitle = "Вход в Чат";
    const ttlUsername="Логин";
    const ttlPassword="Пароль";
    const ttlSubmit = "Логин";
    const ttlUsernameLenError="Логин должен быть минимум 3 букв";
    const ttlPasswordLenError="Пароль должен быть из минимум 8 букв или цифр";

    const history = useHistory();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [usernameError, setUsernameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    const [usernameChanged, setUsernameChanged] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    const validateUsername = (v: string) => {
        if(v.length<3) {
            return ttlUsernameLenError;
        }
        return "";
    };
    const validatePassword = (v: string) => {
        if(v.length<8) {
            return ttlPasswordLenError;
        }
        return "";
    };


    const handleChangeUsername = (value: string) => {
        const err = validateUsername(value);
        setUsername(value);
        setUsernameError(err);
        setUsernameChanged(true);
        setError("");
    };

    const handleChangePassword = (value: string) => {
        const err = validatePassword(value);
        setPassword(value);
        setPasswordError(err);
        setPasswordChanged(true);
        setError("");
    };

    const handleSubmit = async () => {
        let uErr = validateUsername(username);
        let pErr = validatePassword(password);
        if(!uErr && !pErr) {
            try {
                await AuthService.instance().signIn(username, password);
                history.push("/");
                return;
            } catch(err) {
                setError(err.error);
                uErr=err.username;
                pErr=err.password;
            }
        }
        setUsernameError(uErr);
        setUsernameChanged(true);
        setPasswordError(pErr);
        setPasswordChanged(true);
    };


    const submitDisabled = !!error || !!usernameError || !!passwordError;

    const fields: IFormField[] = [
        {
            name: "username",
            label: ttlUsername,
            value: username,
            onChange: handleChangeUsername,
            error: usernameError,
            type: "text",
            changed: usernameChanged
        },
        {
            name: "password",
            label: ttlPassword,
            value: password,
            onChange: handleChangePassword,
            error: passwordError,
            type: "password",
            changed: passwordChanged
        },
    ];



    return (
        <StyledLayout title={ttlTitle}>
            <Form
                title={ttlFormTitle}
                fields={fields}
                submitLabel={ttlSubmit}
                onSubmit={handleSubmit}
                error={error}
                submitDisabled={submitDisabled}
            />
        </StyledLayout>
    );
}

