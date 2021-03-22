import {FormHelperText} from "@material-ui/core";

export interface IValidationErrorProps {
    message: string;
}

export const ValidationError = (props: IValidationErrorProps) => {
    return (
        <FormHelperText error>
            {props.message}
        </FormHelperText>
    );
}