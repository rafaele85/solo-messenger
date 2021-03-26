import {Button, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {TitleCard} from "../title-card";
import {InputField} from "./input-field";
import {FormEvent} from "react";
import {useHistory} from "react-router";
import {ValidationError} from "./validation-error";


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

export interface IFormField {
    name: string;
    label: string;
    isValid?: (val: string) => string;
    minLen?: number;
    minLenError?: string;
    value?: string;
    type?: "text"|"password"|"email"|"tel";
}

export type IFormValues = { [name: string]: string };
export type IFormChanged = { [name: string]: boolean };
export type IFormFieldValidateFunc = (value: string) => string;

export interface IFormProps {
    title?: string;
    fields: IFormField[];
    cancelLabel?: string;
    cancelUrl?: string;
    submitLabel?: string;
    onSubmit: () => void;
    errors?: IFormValues;
    onChange: (fieldName: string, value: string, validationError?: string) => void;
}

export const Form = (props: IFormProps) => {

    const validateField = (f: IFormField, v: string) => {
        if(f.isValid) {
            return f.isValid(v);
        }
        if(f.minLen && v.length<f.minLen) {
            return f.minLenError||`${f.label} should contain at least ${f.minLen} characters`;
        }
        return "";
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        let hasErrors = false;
        for(let f of props.fields) {
            const err = validateField(f, f.value||"");
            props.onChange(f.name, f.value||"", err);
            if(err) {
                hasErrors = true;
            }
        }
        if(!hasErrors) {
            props.onSubmit();
        }
    };

    const updateField = (f: IFormField, val: string) => {
        const err = validateField(f, val);
        props.onChange(f.name, val, err);
    };

    const history = useHistory();
    const handleCancel = () => {
        if(props.cancelUrl) {
            history.push(props.cancelUrl);
        }
    };

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

    let jsxFields: JSX.Element[] = [];
    for(let i=0; i<props.fields.length; i++) {
        const f = props.fields[i];
        const type = f.type || "text";
        jsxFields.push((
            <InputField
                name={f.name}
                label={f.label}
                type={type}
                onChange={(v: string) => updateField(f, v)}
                value={f.value}
                error={(props.errors||{})[f.name]||""}
                autoFocus={i===0}
            />
        ))
    }

    let jsxError;
    let err = props.errors?.error;
    if(err) {
        jsxError = (
            <ValidationError message={err} />
        );
    }



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

    const submitDisabled = !!err || props.fields.some((f: IFormField) => (!!(props.errors||{})[f.name] ) );

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
                {jsxFields}
                {jsxError}
                {jsxButtons}
            </Paper>
        </form>
    )
}

