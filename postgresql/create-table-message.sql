

drop table if exists "message";

create table "message" (
   id SERIAL PRIMARY KEY,
   userId bigint NOT NULL,
   text text not null,
   createdat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updatedat TIMESTAMP WITH TIME ZONE,
   isseen boolean NOT NULL default false,
   foreign key(userId) references "user"(id) on delete cascade
);

create index ix_message_useridcreatedAt on "message"(userId, createdAt);
