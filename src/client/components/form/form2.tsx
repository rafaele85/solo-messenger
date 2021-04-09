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

/**
 * Form props
 */
export interface IFormProps {
    /**
     * For title to display above the form. If not specified, title will not be displayed
     */
    title?: string;
    /**
     * Label to show on Cancel button. If not specified, the Cancel button will not be shown
     */
    cancelLabel?: string;
    /**
     * React router url to go when user presses Cancel button
     */
    cancelUrl?: string;
    /**
     * Label to show on the Submit button. If not specified , default is "Submit"
     */
    submitLabel?: string;
    /**
     * callback to call when user presses Submit button
     */
    onSubmit: () => void;
    /**
     * Submit button is disabled
     */
    submitDisabled?: boolean;
    /**
     * Error message that is not specific to a field (e.g. server error)
     */
    error?: string;
    /**
     * Form children, including form fields
     */
    children?: any;
}

/**
 * Basic form wrapper, provides for box title, and buttons
 * @param props form props (title, etc) see IFormProps
 * @constructor
 */
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

