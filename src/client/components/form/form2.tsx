import {Button, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {TitleCard} from "../title-card";
import {useHistory} from "react-router";
import {ValidationError} from "./validation-error";
import {FormEvent} from "react";

const useStyles = makeStyles((theme: Theme) => {
    return {
        paper: {
            display: "flex",
            flexDirection: "column",
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
}, {name: "form2"});
 
export interface IFormField<T> {
    name: string;
    label: string;
    value?: T;
    type?: "text"|"password"|"email"|"tel";
    onChange: (v: T|undefined) => void;
    error?: string;
    changed?: boolean;    
    autoFocus?: boolean;
}

export type IFormFieldValidateFunc = (value: string) => string;

export interface IFormProps {
    title?: string;
    cancelLabel?: string;
    cancelUrl?: string;
    submitLabel?: string;
    onSubmit: () => void;
    submitDisabled?: boolean;
    error?: string;
    children?: any;
}

export const Form = (props: IFormProps) => {
    const classes = useStyles();

    let jsxTitle;
    if(props.title) {
        jsxTitle = (
            <TitleCard>
                <Typography variant={"h6"} className={classes.description}>
                    {props.title}
                </Typography>
            </TitleCard>
        )
    }

    let jsxError;
    let err = props.error;
    if(err) {
        jsxError = (
            <ValidationError message={err} />
        );
    }

    const history = useHistory();
    const handleCancel = () => {
        if(props.cancelUrl) {
            history.push(props.cancelUrl);
        }
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        props.onSubmit();
    }

    const submitDisabled = props.submitDisabled;

    let jsxCancel;
    if(props.cancelUrl) {
        jsxCancel = (
            <Button
                type={"button"}
                variant="contained"
                className={classes.submit}
                onClick={handleCancel}
            >
                {props.cancelLabel}
            </Button>
        )
    }

    const jsxSubmit = (
        <Button
            type={"submit"}
            color={"primary"}
            variant="contained"
            className={classes.submit}
            disabled={submitDisabled}
        >
            {props.submitLabel}
        </Button>
    );

    let jsxButtons = jsxSubmit;
    if(jsxCancel) {
        jsxButtons = (
            <div className={classes.buttonContainer}>
                {jsxSubmit}
                {jsxCancel}
            </div>
        )
    }

    return (
        <form autoComplete={"off"} noValidate onSubmit={handleSubmit}>
            <Paper className={classes.paper}>
                {jsxTitle}
                {props.children}
                {jsxError}
                {jsxButtons}
            </Paper>
        </form>
    )
}

