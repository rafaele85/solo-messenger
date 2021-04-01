#select * from FriendAddJSON(5, 6);

drop function if exists FriendAddJSON;

create or replace function FriendAddJSON(
  friendid friend.friendId%TYPE,
  userid "user".id%TYPE
)
returns JSONB
as $$
declare
_friendId alias for friendid;
_js JSONB;
_userId alias for userid;
begin

if _userId is null then
   _js:='{"errors": {"error": "error_unauthorized"} }';
   return _js;
end if;

if not exists (select 1 from "user" u where u.id=_friendId) then
   _js:='{"errors": {"error": "error_invalidfriend"} }';
   return _js;
end if;

if exists (select 1 from friend f where f.friendId=_friendId and f.userId=_userId) then
   _js:='{"errors": {"error": "error_alreadyfriend"} }';
   return _js;
end if;

if not exists (select 1 from "message" m where u.fromid=_friendId
   and m.toid=_userid and m.messagetype='friendrequest') then
   _js:='{"errors": {"error": "error_nofriendrequest"} }';
   return _js;
end if;

if (select count(*) from friend f where f.userId=_userId)>=20 then
   _js:='{"errors": {"error": "error_toomanyfriends"} }';
   return _js;
end if;

if (select count(*) from friend f where f.userId=_friendId)>=20 then
   _js:='{"errors": {"error": "error_friendhastoomanyfriends"} }';
   return _js;
end if;

insert into friend(userId, friendId)
select _userId, _friendId and 
not exists (select 1 from friend f where f.userId=_userId and f.friendId=_friendId);

insert into friend(userId, friendId)
select _friendId, _userId and not exists (
   select 1 from friend f where f.userId=_friendId and f.friendId=_userId
);

delete from message where fromid=_userId and toid=_friendId and messagetype='friendrequest';
delete from message where fromid=_friendId and toid=_userId and messagetype='friendrequest';

_js:='{}';

return _js;


end
$$
language plpgsql;
-----------------------------------------

