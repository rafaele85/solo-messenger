import {makeStyles, TextField, Theme} from "@material-ui/core";
import {ChangeEvent} from "react";
import {ValidationError} from "./validation-error";


export type IFieldValue = {
    value: string;
    error?: string;
    changed: boolean;
};

export const defaultFormValue: IFieldValue = {
    value: "",
    error: "",
    changed: false
};


const useStyles = makeStyles( (theme: Theme) => {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
        },
    }
});

export interface IInputFieldProps {
    label: string;
    name: string;
    type?: "text"|"password"|"email"|"tel";
    value: IFieldValue;
    onChange: (v: string) => void;
    autoFocus?: boolean;
}

export const InputField = (props: IInputFieldProps) => {
    const classes = useStyles();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        props.onChange(v);
    };

    let jsxError;
    if(props.value.changed && props.value.error) {
        jsxError = ( <ValidationError message={props.value.error} /> );
    }

    return (
        <div className={classes.container}>
            <TextField
                name={props.name}
                label={props.label}
                type={props.type||"text"}
                value={props.value.value}
                onChange = {handleChange}
                error={!!props.value.error && props.value.changed}
                autoFocus={props.autoFocus}
            />
            {jsxError}
        </div>
    )
}