import { ListItemText } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import {List, makeStyles, Theme} from "@material-ui/core";
import { IFormField } from "./form2";
import {ValidationError} from "./validation-error";

const useStyles = makeStyles( (theme: Theme) => {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            marginTop: "25px",
        },
    }
});
 
export const ListField = (props: IFormField) => {
    const classes = useStyles();

    const handleClick = (v: string) => {
        props.onChange(v);
    };

    let jsxError;
    if(props.changed && props.error) {
        jsxError = ( <ValidationError message={props.error} /> );
    }

    const jsxListItems: JSX.Element[] = [];
    if(props.listValues) {
        for(let i=0; i<props.listValues?.length; i++) {
            const it = props.listValues[i];
            const label = (props.listLabelExtractor ? props.listLabelExtractor(it) : ""+i);
            const value = (props.listValueExtractor ? props.listValueExtractor(it) : ""+i);
            const selected = props.value===value;
            jsxListItems.push((
                <ListItem button selected={selected} 
                    key={value} onClick={() => handleClick(value)}
                >
                    <ListItemText>{label}</ListItemText>
                </ListItem>
            ))
        }
    }
    

    return (
        <div className={classes.container}>
            <label htmlFor={props.name}>
                {props.label}
            </label>
            <List component="ul" id={props.name}>
                {jsxListItems}
            </List>
            {props.error && props.changed && <ValidationError message={props.error} />}
            {jsxError}
        </div>
    )
}
 