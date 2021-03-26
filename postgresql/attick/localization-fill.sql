
delete from localization;

call localizationAdd('signup', 'error.duplicate.username', 
   'This Username already exists', 'Этот логин уже используется'
);
