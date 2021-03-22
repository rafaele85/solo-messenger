import {StyledLayout} from "../layout/styled-layout";
import {Button, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import {selectProfile} from "../../state/root";
import {useHistory} from "react-router";
import {FormEvent, useState} from "react";
import {TitleCard} from "../title-card";
import {IFieldValue, InputField} from "../form/field";


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


export const AddContact = () => {
    const classes = useStyles();
    const title = "Добавить контакт";


    const profile = useSelector(selectProfile);

    const history = useHistory();

    const [queryValue, setQueryValue] = useState<IFieldValue>({value: "", changed: false, error: ""});

    const updateQueryText = (v: string) => {
        const newValue: IFieldValue = {...queryValue};
        newValue.value=v;
        newValue.changed=true;
        setQueryValue(newValue);
    };

    const handleCancel = () => {
        history.push("/");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    };

    const titleSearch="Поиск по имени";
    const titleAdd = "Добавить";
    const titleCancel = "Назад";

    let addDisabled = true;

    return (
        <StyledLayout title={title}>
            <form autoComplete={"off"} noValidate onSubmit={handleSubmit}>
                <Paper className={classes.paper}>
                    <TitleCard>
                        <Typography variant={"h6"} className={classes.description}>
                            Добавление контакта
                        </Typography>
                    </TitleCard>
                    <InputField
                        name={"queryText"}
                        label={titleSearch}
                        onChange={updateQueryText}
                        value={queryValue}
                        autoFocus={true}
                    />


                    <div className={classes.buttonContainer}>
                        <Button
                            type={"submit"}
                            color={"primary"}
                            variant="contained"
                            className={classes.submit}
                            disabled = {addDisabled}
                        >
                            {titleAdd}
                        </Button>

                        <Button
                            type={"button"}
                            variant="contained"
                            className={classes.submit}
                            onClick={handleCancel}
                        >
                            {titleCancel}
                        </Button>
                    </div>
                </Paper>
            </form>
        </StyledLayout>
    );
}
