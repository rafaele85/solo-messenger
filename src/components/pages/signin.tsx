import {StyledLayout} from "../layout/styled-layout";
import {Button, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {TitleCard} from "../title-card";
import {FormEvent, useState} from "react";
import {defaultFormValue, IFieldValue, InputField} from "../form/field";
import {AuthService} from "../../service/auth";
import {ValidationError} from "../form/validation-error";

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
        }
    }
});


export const SignIn = () => {

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let uErr = validateUsername(usernameValue.value);
        let pErr = validatePassword(passwordValue.value);

        if(!uErr && !pErr) {
            try {
                await AuthService.instance().signIn(usernameValue.value, passwordValue.value);
                return;
            } catch(err) {
                if(err.username) {
                    uErr=err.username;
                }
                if(err.password) {
                    pErr = err.password;
                }
                if(err.error) {
                    setError(err.error);
                }
            }
        }
        if(uErr) {
            setUsernameValue({...usernameValue, error: uErr, changed: true});
        }
        if(pErr) {
            setPasswordValue({...passwordValue, error: pErr, changed: true});
        }
    };

    const classes = useStyles();

    const [usernameValue, setUsernameValue] = useState<IFieldValue>({...defaultFormValue});
    const [passwordValue, setPasswordValue] = useState<IFieldValue>({...defaultFormValue});
    const [error, setError] = useState<string>("");

    const validateUsername = (v: string) => {
        let err="";
        if(v.length<3) {
            err="Логин должен быть минимум 3 букв";
        }
        return err;
    }
    const updateUsername = (v: string) => {
        const newValue: IFieldValue = {...usernameValue};
        newValue.value=v;
        newValue.changed=true;
        const err = validateUsername(v);
        newValue.error = err;
        setUsernameValue(newValue);
        setError("");
    };

    const validatePassword = (v: string) => {
        let err="";
        if(v.length<8) {
            err="Пароль должен быть из минимум 8 букв или цифр";
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

    let jsxError;
    if(error) {
        jsxError = (
            <ValidationError message={error} />
        )
    }

    console.log(`error=${error}`)

    const submitDisabled = !!usernameValue.error || !!passwordValue.error || !!error;
    const titleUsername="Логин";
    const titlePassword="Пароль";
    const titleLogin="Логин";

    return (
        <StyledLayout title={"Добро пожаловать в Chat"}>
            <form autoComplete={"off"} noValidate onSubmit={handleSubmit}>
                <Paper className={classes.paper}>
                    <TitleCard>
                        <Typography variant={"h6"} className={classes.description}>
                            Вход в Чат
                        </Typography>
                    </TitleCard>
                    <InputField
                        name={"username"}
                        label={titleUsername}
                        onChange={updateUsername}
                        value={usernameValue}
                        autoFocus={true}
                    />

                    <InputField
                        label={titlePassword}
                        name={"password"}
                        type={"password"}
                        value={passwordValue}
                        onChange = {updatePassword}
                    />
                    {jsxError}

                    <Button
                        type={"submit"}
                        color={"primary"}
                        variant="contained"
                        className={classes.submit}
                        disabled={submitDisabled}
                    >
                        {titleLogin}
                    </Button>
                </Paper>
            </form>
        </StyledLayout>
    );
}

