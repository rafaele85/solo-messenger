import {StyledLayout} from "../layout/styled-layout";
import {Button, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {TitleCard} from "../title-card";
import {defaultFormValue, IFieldValue, InputField} from "../form/field";
import {FormEvent, useState} from "react";
import {ValidationError} from "../form/validation-error";
import {AuthService} from "../../service/auth";
import {useSelector} from "react-redux";
import {selectProfile} from "../../state/root";
import {useHistory} from "react-router";


const useStyles = makeStyles((theme: Theme) => {
    return {
        paper: {
            display: "flex",
            flexDirection: "column",
            maxWidth: "300px",
            margin: "20px auto",
            padding: `${theme.spacing(2)}px`,
        },
        description: {
            width: "400px",
        },
        submit: {
            marginTop: `${theme.spacing(4)}px`,
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        }
    }
});

export const Profile = () => {
    const title = "Профайл";

    const classes = useStyles();

    const profile = useSelector(selectProfile);

    const history = useHistory();

    const handleCancel = () => {
        history.push("/");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let nErr = validateName(nameValue.value);
        let pErr = validatePassword(passwordValue.value);
        let cErr = validateConfirmPassword(confirmPasswordValue.value);


        if(!nErr && !pErr && !cErr) {
            try {
                await AuthService.instance().updateProfile(nameValue.value, passwordValue.value, confirmPasswordValue.value);
                history.push("/");
                return;
            } catch(err) {
                if(err.name) {
                    nErr=err.name;
                }
                if(err.password) {
                    pErr = err.password;
                }
                if(err.confirmPassword) {
                    cErr = err.confirmPassword;
                }
                if(err.error) {
                    setError(err.error);
                }
            }
        }
        if(nErr) {
            setNameValue({...nameValue, error: nErr, changed: true});
        }
        if(pErr) {
            setPasswordValue({...passwordValue, error: pErr, changed: true});
        }
        if(cErr) {
            setConfirmPasswordValue({...confirmPasswordValue, error: cErr, changed: true});
        }
    };

    const [nameValue, setNameValue] = useState<IFieldValue>({...defaultFormValue, value: profile?.name||""});
    const [passwordValue, setPasswordValue] = useState<IFieldValue>({...defaultFormValue});
    const [confirmPasswordValue, setConfirmPasswordValue] = useState<IFieldValue>({...defaultFormValue});
    const [error, setError] = useState<string>("");

    const validateName = (v: string) => {
        let err="";
        if(v.length<3) {
            err="В имени должно быть как минимум 3 буквы";
        }
        return err;
    }
    const updateName = (v: string) => {
        const newValue: IFieldValue = {...nameValue};
        newValue.value=v;
        newValue.changed=true;
        const err = validateName(v);
        newValue.error = err;
        setNameValue(newValue);
        setError("");
    };

    const validatePassword = (v: string) => {
        let err="";
        if(v.length<8) {
            err="Пароль должен быть из минимум букв и цифр";
        }
        return err;
    };

    const updatePassword = (v: string) => {
        const newValue: IFieldValue = {...passwordValue};
        newValue.value=v;
        newValue.changed=true;
        newValue.error=validatePassword(v);
        setPasswordValue(newValue);
        setError("");
    };


    const validateConfirmPassword = (v: string) => {
        let err="";
        if(v!==passwordValue.value) {
            err="Подтверждение пароля не совпадает с паролем";
        }
        return err;
    };

    const updateConfirmPassword = (v: string) => {
        const newValue: IFieldValue = {...confirmPasswordValue};
        newValue.value=v;
        newValue.changed=true;
        newValue.error=validateConfirmPassword(v);
        setConfirmPasswordValue(newValue);
        setError("");
    };

    let jsxError;
    if(error) {
        jsxError = (
            <ValidationError message={error} />
        )
    }

    console.log(`error=${error}`)

    const submitDisabled = !!nameValue.error || !!passwordValue.error || !!confirmPasswordValue.error || !!error;
    const titleName = "Имя";
    const titlePassword = "Пароль";
    const titleConfirmPassword = "Подтверждение пароля";
    const titleSave = "Сохранить";
    const ttlCancel = "Отмена";

    return (
        <StyledLayout title={title}>
            <form autoComplete={"off"} noValidate onSubmit={handleSubmit}>
                <Paper className={classes.paper}>
                    <TitleCard>
                        <Typography variant={"h6"} className={classes.description}>
                            Мой профайл
                        </Typography>
                    </TitleCard>
                    <InputField
                        name={"name"}
                        label={titleName}
                        onChange={updateName}
                        value={nameValue}
                        autoFocus={true}
                    />

                    <InputField
                        label={titlePassword}
                        name={"password"}
                        type={"password"}
                        value={passwordValue}
                        onChange = {updatePassword}
                    />

                    <InputField
                        label={titleConfirmPassword}
                        name={"confirmPassword"}
                        type={"password"}
                        value={confirmPasswordValue}
                        onChange = {updateConfirmPassword}
                    />
                    {jsxError}

                    <div className={classes.buttonContainer}>
                        <Button
                            type={"submit"}
                            color={"primary"}
                            variant="contained"
                            className={classes.submit}
                            disabled={submitDisabled}
                        >
                            {titleSave}
                        </Button>

                        <Button
                            type={"button"}
                            variant="contained"
                            className={classes.submit}
                            onClick={handleCancel}
                        >
                            {ttlCancel}
                        </Button>
                    </div>
                </Paper>
            </form>
        </StyledLayout>
    )
}