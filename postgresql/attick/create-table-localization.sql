drop table if exists localization;


create table localization (
   id SERIAL PRIMARY KEY,
   tier int not null,  --- this is to control order of loading localization batches, e.g. tier1 for login, tier2 for checkPhoenConnection, tier3 for main menu etc. This field is not used for anything else but that
   category varchar(100) not null,
   resource varchar(100) not null,
   lang varchar(2) not null,
   value text not null
);

create unique index ix_localizationkey on localization(category, resource, lang);
