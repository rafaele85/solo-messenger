
CREATE TYPE TYPE_MESSAGETYPE AS ENUM ('message', 'friendrequest');
 
create table "message" (
   id SERIAL PRIMARY KEY,
   fromid bigint NOT NULL,
   toid bigint NOT NULL,
   message text not null,
   createdat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updatedat TIMESTAMP WITH TIME ZONE,
   isseen boolean NOT NULL default false,
   messagetype TYPE_MESSAGETYPE not null default 'message',
   foreign key(fromid) references "user"(id) on delete cascade,
   foreign key(toid) references "user"(id) on delete cascade
);

create index ix_message_fromIdtoIdcreatedAt on "message"(fromid, toid, createdat);
