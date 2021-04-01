create table "user"(
   id SERIAL PRIMARY KEY,
   name varchar(50) NOT NULL,
   username varchar(100) NOT NULL,
   hashPassword varchar(100) NOT NULL,
   avatar varchar(100) null
);

create unique index ix_user_username on "user"(username);
