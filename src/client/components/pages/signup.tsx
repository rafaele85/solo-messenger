import { Link } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { AuthService } from "../../service/auth";
import { localization } from "../../service/localization";
import { selectLanguage } from "../../state/root";
import { IMenuUrls } from "../../client-types/menu";
import { Form} from "../form/form2";
import { StyledLayout } from "../layout/styled-layout";
import {InputField} from "../form/input-field";

export const SignUp = () => {
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.SIGNUP, lang);

    const ttlTitle = t(ILocalizationResource.TITLE)||"Добро пожаловать в Chat";
    const ttlFormTitle = t(ILocalizationResource.FORMTITLE)||"Регистрация пользователя";

    const ttlName=t(ILocalizationResource.NAME)||"Имя";
    const ttlUsername=t(ILocalizationResource.USERNAME)||"Логин";
    const ttlPassword=t(ILocalizationResource.PASSWORD)||"Пароль";
    const ttlConfirmPassword = t(ILocalizationResource.CONFIRMPASSWORD)||"Подтверждение пароля";
    const ttlSubmit = t(ILocalizationResource.SUBMITBUTTON)||"Зарегистрироваться";

    const ttlHaveAcct = t(ILocalizationResource.HAVEACCT)||"Уже зарегистрированы?";
    
    const ttlDosignin = t(ILocalizationResource.DOSIGNIN)||"Войти";

    const ttlNameLenError=ILocalizationResource.ERROR_NAMELEN;
    const ttlUsernameLenError=ILocalizationResource.ERROR_USERNAMELEN;
    const ttlPasswordLenError=ILocalizationResource.ERROR_PASSWORDLEN;
    const ttlPasswordMismatchError=ILocalizationResource.ERROR_PASSWORDMISMATCH;


    const history = useHistory();

    const [username, setUsername] = useState<string|undefined>("");
    const [name, setName] = useState<string|undefined>("");
    const [password, setPassword] = useState<string|undefined>("");
    const [confirmPassword, setConfirmPassword] = useState<string|undefined>("");

    const [nameError, setNameError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    const [nameChanged, setNameChanged] = useState<boolean>(false);
    const [usernameChanged, setUsernameChanged] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [confirmPasswordChanged, setConfirmPasswordChanged] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    const validateName = (v: string|undefined) => {
        if(!v || v.length<3) {
            return ttlNameLenError;
        }
        return "";
    };

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
    const validateConfirmPassword = (v: string|undefined) => {
        if(v!==password) {
            return ttlPasswordMismatchError;
        }
        return "";
    };

    const handleChangeName = (value: string|undefined) => {
        const err = validateName(value);
        setName(value);
        setNameError(err);
        setNameChanged(true);
        setError("");
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
        setPassword(value);
        setPasswordError(err);
        setPasswordChanged(true);
        setError("");
    };

    const handleChangeConfirmPassword = (value: string|undefined) => {
        const err = validateConfirmPassword(value);
        setConfirmPassword(value);
        setConfirmPasswordError(err);
        setConfirmPasswordChanged(true);
        setError("");
    };

    const handleSubmit = async () => {
        let nErr = validateName(name);
        let uErr = validateUsername(username);
        let pErr = validatePassword(password);
        let cErr = validateConfirmPassword(confirmPassword);
        if(!uErr && !pErr &&!nErr && !cErr && username && password && confirmPassword) {
            try {
                await AuthService.instance().signUp(name||"", username, password, confirmPassword);
                history.push(IMenuUrls.HOME);
                return;
            } catch(err) {
                setError(err.error);
                nErr=err.name;
                uErr=err.username;
                pErr=err.password;
                cErr=err.confirmPassword;
            }
        }
        setNameError(nErr);
        setNameChanged(true);
        setUsernameError(uErr);
        setUsernameChanged(true);
        setPasswordError(pErr);
        setPasswordChanged(true);
        setConfirmPasswordError(cErr);
        setConfirmPasswordChanged(true);
    };

    const handleSignin = () => {
        history.push("/signin");
    };

    const submitDisabled = !!error || !!usernameError || !!passwordError;

    const nameErrorLocalized = (nameError ? t(nameError) : "");
    const usernameErrorLocalized = (usernameError ? t(usernameError) : "");
    const passwordErrorLocalized = (passwordError ? t(passwordError) : "");
    const confirmPasswordErrorLocalized = (confirmPasswordError ? t(confirmPasswordError) : "");
    const errorLocalized = (error ? t(error) : "");


    return (
        <StyledLayout title={ttlTitle}>
            <Form
                title={ttlFormTitle}
                submitLabel={ttlSubmit}
                onSubmit={handleSubmit}
                error={errorLocalized}
                submitDisabled={submitDisabled}
            >
                <InputField
                    autoFocus={true}
                    name={"name"}
                    label={ttlName}
                    onChange={handleChangeName}
                    value={name}
                    changed={nameChanged}
                    error={nameErrorLocalized}
                    type={"text"}
                />

                <InputField
                    name={"username"}
                    label={ttlUsername}
                    onChange={handleChangeUsername}
                    value={username}
                    changed={usernameChanged}
                    error={usernameErrorLocalized}
                    type={"text"}
                />

                <InputField
                    name={"password"}
                    label={ttlPassword}
                    onChange={handleChangePassword}
                    value={password}
                    changed={passwordChanged}
                    error={passwordErrorLocalized}
                    type={"password"}
                />

                <InputField
                    name={"confirmPassword"}
                    label={ttlConfirmPassword}
                    onChange={handleChangeConfirmPassword}
                    value={confirmPassword}
                    changed={confirmPasswordChanged}
                    error={confirmPasswordErrorLocalized}
                    type={"password"}
                />

            </Form>
            <div>
                {ttlHaveAcct}&nbsp;<Link onClick={handleSignin}>{ttlDosignin}</Link>
            </div>
        </StyledLayout>
    );
}

