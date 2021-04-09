import {makeStyles, TextField, Theme} from "@material-ui/core";
import {ChangeEvent} from "react";
import { IFormField } from "./form2";
import {ValidationError} from "./validation-error";

const useStyles = makeStyles( (theme: Theme) => {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
        },
    }
}, {name: "input-field"});

export interface IInputFieldProps extends IFormField<string> {

}

/**
 * Basic text input field, can be regular text field, password, email or tel
 * @param props field props (see IFormField)
 * @constructor
 */
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