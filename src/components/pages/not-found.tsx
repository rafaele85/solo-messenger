import {StyledLayout} from "../layout/styled-layout";
import {Link} from "react-router-dom";

export const NotFound = () => {
    const title="Страница не найдена";
    return (
        <StyledLayout title={title}>
             <Link to="/home"> {title} </Link>
        </StyledLayout>
    );
}

