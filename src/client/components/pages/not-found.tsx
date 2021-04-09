import {StyledLayout} from "../layout/styled-layout";
import {Link} from "react-router-dom";
import { IMenuUrls } from "../../client-types/menu";
import { localization } from '../../service/localization';
import { ILocalizationCategory, ILocalizationResource } from "../../../shared/types/localization";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../state/root";

/**
 * Page to show when an unknown url is specified (normally should not happen)
 * @constructor
 */
export const NotFound = () => {    
    const lang = useSelector(selectLanguage);
    const t = localization(ILocalizationCategory.PAGENOTFOUND, lang);

    const title=t(ILocalizationResource.TITLE) || "Страница не найдена";
    return (
        <StyledLayout title={title}>
             <Link to={IMenuUrls.HOME}> {title} </Link>
        </StyledLayout>
    );
}

