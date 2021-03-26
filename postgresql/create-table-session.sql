
drop table if exists session;

create table session (
   id SERIAL PRIMARY KEY,
   sessionkey varchar(100),
   userId bigint NOT NULL,
   foreign key(userId) references "user"(id) on delete cascade   
);

create index ix_sessionUserId on session(userId);
create index ix_sessionSessionKey on session(sessionkey);
