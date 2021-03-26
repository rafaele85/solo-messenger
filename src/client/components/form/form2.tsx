import {Button, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {TitleCard} from "../title-card";
import {InputField} from "./field";
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
});
 
export interface IFormField {
    name: string;
    label: string;
    value?: string;
    type?: "text"|"password"|"email"|"tel";
    onChange: (v: string) => void;
    error?: string;
    changed?: boolean;
}

export type IFormFieldValidateFunc = (value: string) => string;

export interface IFormProps {
    title?: string;
    fields: IFormField[];
    cancelLabel?: string;
    cancelUrl?: string;
    submitLabel?: string;
    onSubmit: () => void;
    submitDisabled?: boolean;
    error?: string;
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

    const handleChange = (v: string, field: IFormField) => {
        field.onChange(v);
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

    const jsxFields: JSX.Element[] = [];
    for(let i=0; i<props.fields.length; i++) {
        const f = props.fields[i];
        jsxFields.push((
            <InputField
                key={f.name}
                label={f.label}
                name={f.name}
                onChange={(v: string) => handleChange(v, f)}
                value={f.value}
                error={f.error}
                changed={f.changed}
                type={f.type}
            />
        ));
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

