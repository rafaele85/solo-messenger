import {StyledLayout} from "../layout/styled-layout";
import {useState} from "react";
import {AuthService} from "../../service/auth";
import {Form, IFormField} from "../form/form2";
import {useHistory} from "react-router";
import {Link} from "@material-ui/core";
import { IMenuUrls } from "../../client-types/menu";
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { localization } from "../../service/localization";
import { selectLanguage } from "../../state/root";
import { useSelector } from "react-redux";

export const SignIn = () => {    
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.SIGNIN, lang);
    
    const ttlTitle = t(ILocalizationResource.TITLE)||"Добро пожаловать в Chat";
    const ttlFormTitle = t(ILocalizationResource.FORMTITLE)||"Вход в Чат";
    const ttlUsername=t(ILocalizationResource.USERNAME)||"Логин";
    const ttlPassword=t(ILocalizationResource.PASSWORD)||"Пароль";

    const ttlUsernameLenError=ILocalizationResource.ERROR_USERNAMELEN;    
    const ttlPasswordLenError=ILocalizationResource.ERROR_PASSWORDLEN;
    
    const ttlNoAcct = t(ILocalizationResource.NOTREGISTEREDYET)||"Еще не зарегистрированы?";
    const ttlSignup = t(ILocalizationResource.DOSIGNUP)||"Зарегистрироваться";
    const ttlSubmit = t(ILocalizationResource.SUBMITBUTTON)||"Вход";

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

        console.log("~~~~~password err=", err)
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
                history.push(IMenuUrls.HOME);
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

    const handleSignUp = () => {
        history.push(IMenuUrls.SIGNUP);
    };

    const submitDisabled = !!error || !!usernameError || !!passwordError;

    const usernameErrLocalized=(usernameError ? t(usernameError) : "");
    const passwordErrLocalized=(passwordError ? t(passwordError) : "");

    const errLocalized = (error ? t(error) : "");
    console.log(`~~~~error=${error} localized=${errLocalized}`)

    const fields: IFormField[] = [
        {
            name: "username",
            label: ttlUsername,
            value: username,
            onChange: handleChangeUsername,
            error: usernameErrLocalized,
            type: "text",
            changed: usernameChanged
        },
        {
            name: "password",
            label: ttlPassword,
            value: password,
            onChange: handleChangePassword,
            error: passwordErrLocalized,
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
                error={errLocalized}
                submitDisabled={submitDisabled}
            />
            <div>
                {ttlNoAcct}&nbsp;<Link onClick={handleSignUp}>{ttlSignup}</Link>
            </div>
        </StyledLayout>
    );
}

