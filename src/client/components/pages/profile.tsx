import {StyledLayout} from "../layout/styled-layout";
import {useEffect, useState} from "react";
import {AuthService} from "../../service/auth";
import {useSelector} from "react-redux";
import {selectLanguage} from "../../state/root";
import {useHistory} from "react-router";
import {Form} from "../form/form2";
import { IMenuUrls } from "../../client-types/menu";
import { localization } from "../../service/localization";
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import {IProfile} from "../../../shared/types/profile";
import {InputField} from "../form/input-field";
import {ImageUploadField} from "../form/image-upload-field";


/**
 * User's profile edit form.
 * Brings up the user profile data from server upon mount.
 * User can change their password, name , and upload avatar image
 * The form performs validation of name, password, and the confirm password fields upon change and upon submit.
 * When submitted, saves the data to the server. If an error is returned from the server, shows it in the appropriate
 * field error or non-field specific error component
 * @constructor
 */
export const Profile = () => {
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.PROFILE, lang);

    const ttlName = t(ILocalizationResource.NAME)||"Имя";
    const ttlPassword = t(ILocalizationResource.PASSWORD)||"Пароль";
    const ttlAvatar = t(ILocalizationResource.AVATAR)||"Аватар";
    const ttlConfirmPassword = t(ILocalizationResource.PASSWORD)||"Подтверждение пароля";
    const ttlSave = t(ILocalizationResource.SAVEBUTTON)||"Сохранить";
    const ttlCancel = t(ILocalizationResource.CANCELBUTTON)||"Назад";
    const ttlTitle = t(ILocalizationResource.TITLE)||"Мой профиль";

    const ttlNameLenError = ILocalizationResource.ERROR_NAMELEN;
    const ttlPasswordLenError = ILocalizationResource.ERROR_PASSWORDLEN;
    const ttlPasswordMismatchError = ILocalizationResource.ERROR_PASSWORDMISMATCH;

    const history = useHistory();

    const [profile, setProfile] = useState<IProfile|undefined>(undefined);

    const [name, setName] = useState<string|undefined>(profile?.name||"");
    const [password, setPassword] = useState<string|undefined>("");
    const [confirmPassword, setConfirmPassword] = useState<string|undefined>("");
    const [avatar, setAvatar] = useState<File|undefined>();
    const [avatarUrl, setAvatarUrl] = useState<string|undefined>();

    const [nameError, setNameError] = useState<string|undefined>();
    const [passwordError, setPasswordError] = useState<string|undefined>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
    const [avatarError, setAvatarError] = useState<string>("");

    const [nameChanged, setNameChanged] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [confirmPasswordChanged, setConfirmPasswordChanged] = useState<boolean>(false);
    const [avatarChanged, setAvatarChanged] = useState<boolean>(false);

    const [error, setError] = useState<string|undefined>();

    useEffect(() => {
        let mounted=true;

        const fetchData = async () => {
            try {
                const p = await AuthService.instance().profileGet();
                console.log("Profile.fetchData = ",p)
                if(mounted) {
                    setProfile(p);
                    setName(p?.name);
                    setAvatarUrl(p?.avatar)
                }
            } catch(err) {
                console.error(err);
            }
        };

        if(mounted) {
            fetchData();
        }

        return () => {
            mounted=false;
        }

    }, []);


    const validateName = (v: string|undefined) => {
        if(!v || v.length<3) {
            return ttlNameLenError;
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
    const validateAvatar = (_v: File|undefined) => {
        return "";
    };

    const handleChangeName = (value: string|undefined) => {
        const err = validateName(value);
        setName(value);
        setNameError(err);
        setNameChanged(true);
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

    const handleChangeAvatar = (value: File|undefined) => {
        const err = validateAvatar(value);
        setAvatar(value);
        if (value) {
            const reader = new FileReader();
            reader.onload = (ev: ProgressEvent<FileReader>) => {
                const du = ev.target?.result?.toString();
                console.log("du=", du)
                setAvatarUrl(du);
            }
            reader.readAsDataURL(value);
        } else {
            setAvatarUrl(undefined);
        }
        setAvatarError(err);
        setAvatarChanged(true);
        setError("");
    };

    const handleSubmit = async () => {
        let nErr = validateName(name);
        let pErr = validatePassword(password);
        let cErr = validateConfirmPassword(confirmPassword);
        let aErr = validateAvatar(avatar);

        if(!nErr && !pErr && !cErr && !aErr && name && password && confirmPassword) {
            try {
                await AuthService.instance().updateProfile(name, password, confirmPassword, avatar);
                history.push(IMenuUrls.HOME);
                return;
            } catch(err) {
                setError(err.error);
                nErr=err.name;
                pErr=err.password;
                cErr=err.confirmPassword;
                aErr=err.avatar;
            }
        }
        setNameError(nErr);
        setNameChanged(true);
        setPasswordError(pErr);
        setPasswordChanged(true);
        setConfirmPasswordError(cErr);
        setConfirmPasswordChanged(true);
        setAvatarError(aErr);
        setAvatarChanged(true);
    };

    const submitDisabled = !!error || !!nameError || !!passwordError || !!confirmPasswordError || !!avatarError;

    const nameErrorLocalized = (nameError ? t(nameError) : "");
    const passwordErrorLocalized = (passwordError ? t(passwordError) : "");
    const confirmPasswordErrorLocalized = (confirmPasswordError ? t(confirmPasswordError) : "");
    const avatarErrorLocalized = (avatarError ? t(avatarError) : "");
    const errorLocalized = (error ? t(error) : "");


    return (
        <StyledLayout title={ttlTitle}>
            <Form
                title={ttlTitle}
                cancelLabel={ttlCancel}
                cancelUrl={IMenuUrls.HOME}
                submitLabel={ttlSave}
                onSubmit={handleSubmit}
                submitDisabled={submitDisabled}
                error={errorLocalized}
            >
                <InputField
                    name="name"
                    label={ttlName}
                    value={name}
                    onChange={handleChangeName}
                    error={nameErrorLocalized}
                    type={"text"}
                    changed={nameChanged}
                />
                <InputField
                    name="password"
                    label={ttlPassword}
                    value={password}
                    onChange={handleChangePassword}
                    error={passwordErrorLocalized}
                    type={"password"}
                    changed={passwordChanged}
                />
                <InputField
                    name="confirmPassword"
                    label={ttlConfirmPassword}
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    error={confirmPasswordErrorLocalized}
                    type={"password"}
                    changed={confirmPasswordChanged}
                />
                <ImageUploadField
                    name={"avatar"}
                    label={ttlAvatar}
                    value={avatar}
                    url = {avatarUrl}
                    onChange={handleChangeAvatar}
                    error={avatarErrorLocalized}
                    changed={avatarChanged}
                />
            </Form>
        </StyledLayout>
    )
}
