import {IconButton, makeStyles, Theme} from "@material-ui/core";
import {ChangeEvent} from "react";
import { IFormField } from "./form2";
import {ValidationError} from "./validation-error";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles( (_theme: Theme) => {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
        },
        container2: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
        },
        input: {
            display: "none",
        },
        inputError: {
            color: "red",
            border: "1px solid red",
        },
        label: {            
        },
        camera: {
            color: "white",
        },
        avatar: {
            width: "25px",
            height: "25px",
            borderRadius: "50%"
        }
    }
}, {name: "image-upload-field"});

export interface IImageUploadFieldProps extends IFormField<File>{
    url?: string;
}


export const ImageUploadField = (props: IImageUploadFieldProps) => {
    const classes = useStyles();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target?.files?.[0]||undefined);
    };

    let jsxError;
    if(props.changed && props.error) {
        jsxError = ( <ValidationError message={props.error} /> );
    }

    const cls = (!!props.error && props.changed ? classes.inputError : classes.input);

    
    //$('#imagePreview').css('background-image', 'url('+e.target.result +')');
    //$('#imagePreview').hide();
    //$('#imagePreview').fadeIn(650);



    let jsxImg;
    if(props.url) {
        jsxImg = (
            <img className={classes.avatar}
                 src={props.url} alt=""
            />
        );
    }

    console.log(`avatar src=${props.url}`, jsxImg);

    return (
        <div className={classes.container}>
            <div className={classes.container2}>
                <label 
                    htmlFor={props.name}
                    className={classes.label}
                >
                    {props.label}
                    <IconButton color="primary" component="span">
                        <PhotoCameraIcon className={classes.camera} />
                    </IconButton>
                </label>
                <input
                    className={cls}
                    name={props.name}
                    onChange = {handleChange}
                    autoFocus={props.autoFocus}
                    accept="image/*"
                    hidden
                    id={props.name}
                    type="file"
                />
                {jsxImg}
            </div>
            {jsxError}
        </div>
    );
}