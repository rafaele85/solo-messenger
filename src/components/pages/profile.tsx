import {StyledLayout} from "../layout/styled-layout";
import {useState} from "react";
import {AuthService} from "../../service/auth";
import {useSelector} from "react-redux";
import {selectProfile} from "../../state/root";
import {useHistory} from "react-router";
import {Form, IFormField} from "../form/form2";

export const Profile = () => {
    const ttlName = "Имя";
    const ttlPassword = "Пароль";
    const ttlConfirmPassword = "Подтверждение пароля";
    const ttlSave = "Сохранить";
    const ttlCancel = "Отмена";
    const ttlNameLenError = "В имени должно быть как минимум 3 буквы";
    const ttlPasswordLenError = "Пароль должен быть из минимум букв и цифр";
    const ttlPasswordMismatchError = "Подтверждение пароля не совпадает с паролем";
    const ttlTitle = "Мой профиль";

    const profile = useSelector(selectProfile);

    const history = useHistory();

    const [name, setName] = useState<string>(profile?.name||"");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [nameError, setNameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    const [nameChanged, setNameChanged] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [confirmPasswordChanged, setConfirmPasswordChanged] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    const validateName = (v: string) => {
        if(v.length<3) {
            return ttlNameLenError;
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
        let pErr = validatePassword(password);
        let cErr = validateConfirmPassword(confirmPassword);
        if(!nErr && !pErr && !cErr) {
            try {
                await AuthService.instance().updateProfile(name, password, confirmPassword);
                history.push("/");
                return;
            } catch(err) {
                setError(err.error);
                nErr=err.name;
                pErr=err.password;
                cErr=err.confirmPassword;
            }
        }
        setNameError(nErr);
        setNameChanged(true);
        setPasswordError(pErr);
        setPasswordChanged(true);
        setConfirmPasswordError(cErr);
        setConfirmPasswordChanged(true);
    };

    const submitDisabled = !!error || !!nameError || !!passwordError || !!confirmPasswordError;

    console.log(`profile: ${error} ${nameError} ${passwordError} ${confirmPasswordError} ${submitDisabled}`)

    const fields: IFormField[] = [
        {
            name: "name",
            label: ttlName,
            value: name,
            onChange: handleChangeName,
            error: nameError,
            type: "text",
            changed: nameChanged
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
        {
            name: "confirmPassword",
            label: ttlConfirmPassword,
            value: confirmPassword,
            onChange: handleChangeConfirmPassword,
            error: confirmPasswordError,
            type: "password",
            changed: confirmPasswordChanged
        }
    ];

    return (
        <StyledLayout title={ttlTitle}>
            <Form
                title={ttlTitle}
                fields={fields}
                cancelLabel={ttlCancel}
                cancelUrl={"/"}
                submitLabel={ttlSave}
                onSubmit={handleSubmit}
                submitDisabled={submitDisabled}
                error={error}
            />
        </StyledLayout>
    )
}
