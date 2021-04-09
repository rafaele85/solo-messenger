import {FormHelperText} from "@material-ui/core";


/**
 * Props for ValidationError component
 */

export interface IValidationErrorProps {
    /**
     * Error message to show
     */
    message: string;
}

/**
 * Show form validation error. This component is used both for field-specific errors
 * and for non-field-specific errors
 * @param props component props see IValidationErrorProps
 * @constructor
 */
export const ValidationError = (props: IValidationErrorProps) => {
    return (
        <FormHelperText error>
            {props.message}
        </FormHelperText>
    );
}