import {Divider, List, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {AuthService} from "../../service/auth";
import {StyledListItem} from "../styled-list-item";
import {useSelector} from "react-redux";
import { selectLanguage} from "../../state/root";
import AddIcon from "@material-ui/icons/AddCircleOutlined";
import {useHistory} from "react-router";
import { IMenuUrls } from "../../client-types/menu";
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { localization } from "../../service/localization";
import {ContactList} from "../contact-list";

const useStyles = makeStyles( (theme: Theme) => {
    return {
        toolbar: theme.mixins.toolbar,
        container: {
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexDirection: "column",
            width: "180px",
        },
        addIcon: {
            paddingRight: "4px",
        },
        mycontacthdr: {
            paddingLeft: `${theme.spacing(1)}px`
        }
    }
}, {name: "menu"});

/**
 * Props for a menu
 */
export interface IMenuProps {
    /**
     * Apart from specifying urls will call this callback (if specified)
     */
    additionalClickEffect?: () => void;
}

export const Menu = (props: IMenuProps) => {
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.MAINMENU, lang);

    const ttl_addcontact = t(ILocalizationResource.ADDCONTACT_MENU);
    const ttl_profile = t(ILocalizationResource.PROFILE_MENU);
    const ttl_exit = t(ILocalizationResource.EXIT_MENU);
    const ttl_mycontacts = t(ILocalizationResource.MYCONTACTS_MENU);

    const classes = useStyles();

    const history = useHistory();
    let currentMenuOption=IMenuUrls.SIGNUP;
    if(history.location.pathname.indexOf(IMenuUrls.ADDCONTACT)>=0) {
        currentMenuOption=IMenuUrls.ADDCONTACT;
    } else if(history.location.pathname.indexOf(IMenuUrls.PROFILE)>=0) {
        currentMenuOption=IMenuUrls.PROFILE;
    }
    console.log(`currentMenuOpton=${currentMenuOption} location=`)

    const handleSignOut = async () => {
        try {
            await AuthService.instance().signOut();
        } catch(err) {
            console.error(err)
        }
    };

    return (
        <Paper className={classes.container}>
            <Typography className={classes.mycontacthdr}>
                {ttl_mycontacts}
            </Typography>
            <Divider />
            <ContactList additionalClickEffect={props.additionalClickEffect} />
            <Divider />
            <List>
                <StyledListItem key={IMenuUrls.ADDCONTACT}
                                to={IMenuUrls.ADDCONTACT}
                                isSelected={(currentMenuOption===IMenuUrls.ADDCONTACT)}
                                onClick={props.additionalClickEffect}
                >
                    <AddIcon className={classes.addIcon} />
                    {ttl_addcontact}
                </StyledListItem>
            </List>
            <Divider />
            <List>
                <StyledListItem key={IMenuUrls.PROFILE}
                                to={IMenuUrls.PROFILE}
                                isSelected={(currentMenuOption===IMenuUrls.PROFILE)}
                                onClick={props.additionalClickEffect}
                >
                    {ttl_profile}
                </StyledListItem>
            </List>
            <Divider />
            <List>
                <StyledListItem 
                    key={"exit"}
                    onClick={handleSignOut}>
                    {ttl_exit}
                </StyledListItem>
            </List>
        </Paper>
    )
}; 
