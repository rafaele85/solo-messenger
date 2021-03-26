import { Link } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { AuthService } from "../../service/auth";
import { localization } from "../../service/localization";
import { selectLanguage } from "../../state/root";
import { IMenuUrls } from "../../types/menu";
import { Form, IFormField } from "../form/form2";
import { StyledLayout } from "../layout/styled-layout";

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

    const [username, setUsername] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [nameError, setNameError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    const [nameChanged, setNameChanged] = useState<boolean>(false);
    const [usernameChanged, setUsernameChanged] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [confirmPasswordChanged, setConfirmPasswordChanged] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    const validateName = (v: string) => {
        if(v.length<3) {
            return ttlNameLenError;
        }
        return "";
    };

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
    const validateConfirmPassword = (v: string) => {
        if(v!==password) {
            return ttlPasswordMismatchError;
        }
        return "";
    };

    const handleChangeName = (value: string) => {
        const err = validateName(value);
        setName(value);
        setNameError(err);
        setNameChanged(true);
        setError("");
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

    const handleChangeConfirmPassword = (value: string) => {
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
        if(!uErr && !pErr &&!nErr && !cErr) {
            try {
                await AuthService.instance().signUp(name, username, password, confirmPassword);
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

    const fields: IFormField[] = [
        {
            name: "name",
            label: ttlName,
            value: name,
            onChange: handleChangeName,
            error: nameErrorLocalized,
            type: "text",
            changed: nameChanged
        },
        {
            name: "username",
            label: ttlUsername,
            value: username,
            onChange: handleChangeUsername,
            error: usernameErrorLocalized,
            type: "text",
            changed: usernameChanged
        },
        {
            name: "password",
            label: ttlPassword,
            value: password,
            onChange: handleChangePassword,
            error: passwordErrorLocalized,
            type: "password",
            changed: passwordChanged
        },
        {
            name: "confirmPassword",
            label: ttlConfirmPassword,
            value: confirmPassword,
            onChange: handleChangeConfirmPassword,
            error: confirmPasswordErrorLocalized,
            type: "password",
            changed: confirmPasswordChanged
        },
    ];



    return (
        <StyledLayout title={ttlTitle}>
            <Form
                title={ttlFormTitle}
                fields={fields}
                submitLabel={ttlSubmit}
                onSubmit={handleSubmit}
                error={errorLocalized}
                submitDisabled={submitDisabled}
            />
            <div>
                {ttlHaveAcct}&nbsp;<Link onClick={handleSignin}>{ttlDosignin}</Link>
            </div>
        </StyledLayout>
    );
}

