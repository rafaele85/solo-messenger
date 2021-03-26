import {makeStyles, Theme} from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) => {
    return {
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
        }
    }
});

type ITitleCardProps = {
    children: any;
}

export const TitleCard = (props: ITitleCardProps) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {props.children}
        </div>
    );
}
