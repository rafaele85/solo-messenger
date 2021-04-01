import { defaultLanguage, ILanguage } from "../../shared/types/language";
import { ILocalizationCategory, ILocalizationResource } from "../../shared/types/localization";

const localizations = new Map<string, string>();

const addl = (key:string, value_en:string, value_ru:string) => {
    localizations.set(`${key}.en`, value_en);
    localizations.set(`${key}.ru`, value_ru);
};

const defaultLang = defaultLanguage();

export const localization = (category: string, lang: ILanguage|undefined) => {
    if(!lang) {
        lang="en";
    }
    return (resource: string) => {
        //console.log(`localization.t lang=${lang}`)
        let key = `${category}.${resource}.${lang}`;
        let val = localizations.get(key);
        //console.log(`useLocalization key=${key} val=${val}`)
        if(val) {
            return val;
        }
        console.warn(`Not found key localization for key ${key}`)
        key = `general.${resource}.${lang}`;
        val = localizations.get(key);
        if(val) {
            return val;
        }
        console.warn(`Not found key localization for key ${key}`)
        key = `${category}.${resource}.${defaultLang}`;
        val = localizations.get(key);
        if(val) {
            return val;
        }
        console.warn(`Not found key localization for key ${key}`)
        key = `general.${resource}.${defaultLang}`;
        val = localizations.get(key);
        if(val) {
            return val;
        }
        console.warn(`Not found key localization for key ${key}`)
        return resource;
    }
};

//------------------------------------

addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_DUPLICATE_USERNAME}`,
       "This Username already exists","Этот логин уже используется"
);
addl(`${ILocalizationCategory.ADDCONTACT}.${ILocalizationResource.ADDCONTACT_TITLE}`,
    "Add contact", "Добавить контакт"
);
addl(`${ILocalizationCategory.ADDCONTACT}.${ILocalizationResource.ADDCONTACT_FORMTITLE}`,
    "Add contact", "Добавление контакта"
);
addl(`${ILocalizationCategory.ADDCONTACT}.${ILocalizationResource.FINDCONTACTBYNAME}`,
    "Find contact by name", "Поиск по имени"
);
addl(`${ILocalizationCategory.ADDCONTACT}.${ILocalizationResource.SUBMITBUTTON}`,
    "Add", "Добавить"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.CANCELBUTTON}`,
    "Cancel", "Назад"
);

addl(`${ILocalizationCategory.CHAT}.${ILocalizationResource.CHATWITH}`,
    "Chat with ", "Чат с "
);

addl(`${ILocalizationCategory.PAGENOTFOUND}.${ILocalizationResource.TITLE}`,
    "Page not found", "Страница не найдена"
);

addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.NAME}`,
    "Name", "Имя"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.USERNAME}`,
    "Username", "Логин"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.PASSWORD}`,
    "Pasword", "Пароль"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.CONFIRMPASSWORD}`,
    "Confirm pasword", "Подтверждение пароля"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.SAVEBUTTON}`,
    "Save", "Сохранить"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_NAMELEN}`,
    "Name should have at least 3 letters", "В имени должно быть как минимум 3 буквы"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_USERNAMELEN}`,
    "Username should have at least 3 characters", "В логине должно быть как минимум 3 символа"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_PASSWORDLEN}`,
    "Password should have at least 8 characters", "В пароле должно быть как минимум 8 символа"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_PASSWORDMISMATCH}`,
    "Passwords don't match", "Подтверждение пароля не совпадает с паролем"
);
addl(`${ILocalizationCategory.PROFILE}.${ILocalizationResource.TITLE}`,
    "My profile", "Мой профиль"
);
addl(`${ILocalizationCategory.SIGNIN}.${ILocalizationResource.TITLE}`,
    "Welcome to Chat", "Добро пожаловать в Чат"
);
addl(`${ILocalizationCategory.SIGNIN}.${ILocalizationResource.FORMTITLE}`,
    "Sign in to Chat", "Вход в Чат"
);
addl(`${ILocalizationCategory.SIGNIN}.${ILocalizationResource.NOTREGISTEREDYET}`,
    "Not registered yet?", "Еще не зарегистрированы?"
);
addl(`${ILocalizationCategory.SIGNIN}.${ILocalizationResource.DOSIGNUP}`,
    "Sign up", "Зарегистрироваться"
);
addl(`${ILocalizationCategory.SIGNIN}.${ILocalizationResource.SUBMITBUTTON}`,
    "SIGNIN", "ВХОД"
);


addl(`${ILocalizationCategory.SIGNUP}.${ILocalizationResource.TITLE}`,
    "Sign up for Chat", "Регистрация пользователя"
);
addl(`${ILocalizationCategory.SIGNUP}.${ILocalizationResource.FORMTITLE}`,
    "Sign up for Chat", "Регистрация пользователя"
);
addl(`${ILocalizationCategory.SIGNUP}.${ILocalizationResource.SUBMITBUTTON}`,
    "SIGNUP", "Зарегистрироваться"
);
addl(`${ILocalizationCategory.SIGNUP}.${ILocalizationResource.HAVEACCT}`,
    "Already have an account?", "Уже зарегистрированы?"
);
addl(`${ILocalizationCategory.SIGNUP}.${ILocalizationResource.DOSIGNIN}`,
    "Sign in", "Войти"
);


addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_LOGINFAILED}`,
    "Sign in failed", "Ошибка при входе в систему"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_SIGNUPFAILED}`,
    "Sign up failed", "Ошибка регистрации"
);
addl(`${ILocalizationCategory.GENERAL}.${ILocalizationResource.ERROR_SAVINGPROFILE}`,
    "An error occured", "Произошла ошибка"
);

addl(`${ILocalizationCategory.MAINMENU}.${ILocalizationResource.ADDCONTACT_MENU}`,
    "Add Contact", "Добавить контакт"
);
addl(`${ILocalizationCategory.MAINMENU}.${ILocalizationResource.PROFILE_MENU}`,
    "Profile", "Профайл"
);
addl(`${ILocalizationCategory.MAINMENU}.${ILocalizationResource.EXIT_MENU}`,
    "Exit", "Выход"
);
addl(`${ILocalizationCategory.MAINMENU}.${ILocalizationResource.MYCONTACTS_MENU}`,
    "My Contacts", "Мои Контакты"
);
addl(`${ILocalizationCategory.ADDCONTACT}.${ILocalizationResource.CONTACTLIST}`,
    "Search results", "Результаты поиска"
);
addl(`${ILocalizationCategory.ADDCONTACT}.${ILocalizationResource.ERROR_CONTACTNOTSELECTED}`,
    "Contact is not selected", "Не выбран контакт"
);
addl(`${ILocalizationCategory.CHAT}.${ILocalizationResource.TYPEMESSAGE}`,
    "Type message...", "Ведите сообщение..."
);
addl(`${ILocalizationCategory.PROFILE}.${ILocalizationResource.AVATAR}`,
    "Upload your avatar", "Загрузите ваш аватар"
);
addl(`${ILocalizationCategory.HOME}.${ILocalizationResource.SELECTCONTACT}`,
    "Select a contact to begin chatting", "Выберите контакт чтобы начать чат"
);
addl(`${ILocalizationCategory.HOME}.${ILocalizationResource.TITLE}`,
    "Chat", "Чат"
);

