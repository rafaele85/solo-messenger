drop table if exists "friend";

create table friend (
   id SERIAL PRIMARY KEY,
   userId bigint NOT NULL,
   friendId bigint NOT NULL,
   foreign key(userId) references "user"(id) on delete cascade,
   foreign key(friendId) references "user"(id) on delete cascade
);

create index ix_friend_userIdfriendId on friend(userId,friendId);
