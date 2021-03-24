import {makeStyles, TextField, Theme} from "@material-ui/core";
import {ChangeEvent} from "react";
import {ValidationError} from "./validation-error";

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
    changed?: boolean;
    value?: string;
    error?: string;
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
    if(props.changed && props.error) {
        jsxError = ( <ValidationError message={props.error} /> );
    }

    return (
        <div className={classes.container}>
            <TextField
                name={props.name}
                label={props.label}
                type={props.type||"text"}
                value={props.value}
                onChange = {handleChange}
                error={!!props.error && props.changed}
                autoFocus={props.autoFocus}
            />
            {jsxError}
        </div>
    )
}