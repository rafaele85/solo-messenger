export interface IProfile {
    name: string;
    avatar?: string;
}

export interface IProfileUpdateData extends IProfile {
    hashPassword: string;
    hashConfirmPassword: string;
}
