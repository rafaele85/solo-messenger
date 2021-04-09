import {StyledLayout} from "../layout/styled-layout";
import {useState} from "react";
import {AuthService} from "../../service/auth";
import {Form} from "../form/form2";
import {useHistory} from "react-router";
import {Link} from "@material-ui/core";
import { IMenuUrls } from "../../client-types/menu";
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { localization } from "../../service/localization";
import { selectLanguage } from "../../state/root";
import { useSelector } from "react-redux";
import {InputField} from "../form/input-field";

/**
 * User sign in form.
 * Contains username, password fields and Signin button
 * Also it allows for selecting Sign up link to switch to Sign up form if the user does not have account yet
 * The form performs validation of username and password upon change and upon submit
 * Upon submit triggers signin endpoint on the server through AuthService and upon errors from the service
 * shows the errors under appropriate field
 * @constructor
 */
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

    const [username, setUsername] = useState<string|undefined>("");
    const [password, setPassword] = useState<string|undefined>("");

    const [usernameError, setUsernameError] = useState<string|undefined>("");
    const [passwordError, setPasswordError] = useState<string|undefined>("");

    const [usernameChanged, setUsernameChanged] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    const validateUsername = (v: string|undefined) => {
        if(!v || v.length<3) {
            return ttlUsernameLenError;
        }
        return "";
    };
    const validatePassword = (v: string|undefined) => {
        if(!v || v.length<8) {
            return ttlPasswordLenError;
        }
        return "";
    };


    const handleChangeUsername = (value: string|undefined) => {
        const err = validateUsername(value);
        setUsername(value);
        setUsernameError(err);
        setUsernameChanged(true);
        setError("");
    };

    const handleChangePassword = (value: string|undefined) => {
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
        if(!uErr && !pErr && username && password) {
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

    return (
        <StyledLayout title={ttlTitle}>
            <Form
                title={ttlFormTitle}
                submitLabel={ttlSubmit}
                onSubmit={handleSubmit}
                error={errLocalized}
                submitDisabled={submitDisabled}
            >
                <InputField
                    name={"username"}
                    label={ttlUsername}
                    value={username}
                    onChange={handleChangeUsername}
                    type={"text"}
                    autoFocus={true}
                    error={usernameErrLocalized}
                    changed={usernameChanged}
                />
                <InputField
                    name={"password"}
                    label={ttlPassword}
                    value={password}
                    onChange={handleChangePassword}
                    type={"password"}
                    error={passwordErrLocalized}
                    changed={passwordChanged}
                />
            </Form>
            <div>
                {ttlNoAcct}&nbsp;<Link onClick={handleSignUp}>{ttlSignup}</Link>
            </div>
        </StyledLayout>
    );
}

