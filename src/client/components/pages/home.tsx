import {StyledLayout} from "../layout/styled-layout";
import {useSelector} from "react-redux";
import {selectLanguage} from "../../state/root";
import {ILocalizationCategory, ILocalizationResource} from "../../../shared/types/localization";
import {localization} from "../../service/localization";

export const Home = () => {
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.HOME, lang);
    const ttlHome = t(ILocalizationResource.TITLE)||"Чат";
    const ttlSelectContact = t(ILocalizationResource.SELECTCONTACT)||"Выберите контакт чтобы начать чат";
    return (
        <StyledLayout title={ttlHome}>
            {ttlSelectContact}
        </StyledLayout>
    );
}
