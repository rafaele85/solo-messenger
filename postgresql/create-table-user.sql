drop table if exists "user";

create table "user"(
   id SERIAL PRIMARY KEY,
   name varchar(50) NOT NULL,
   username varchar(100) NOT NULL,
   hashPassword varchar(100) NOT NULL
);

create unique index ix_user_username on "user"(username);
