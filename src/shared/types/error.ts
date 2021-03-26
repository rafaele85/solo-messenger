export type IErrors = {
    [key: string]: string;
}

export const UnknownError = () => {
    const errs: IErrors = {};
    errs["error"] = "Unknown error";    
    return errs;
}