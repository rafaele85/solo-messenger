#select * from FriendAddJSON(5, '326cdf5a-0db3-4b12-aa92-a17dff1d0cbc');

drop function if exists FriendAddJSON;

create or replace function FriendAddJSON(
  friendId friend.friendId%TYPE,
  sessionkey session.sessionkey%TYPE
)
returns JSONB
as $$
declare
_friendId alias for friendId;
_sessionkey alias for sessionkey;
_js JSONB;
_userId "user".id%TYPE;
begin

select s.userId into _userId from session s where s.sessionkey=_sessionkey;

if _userId is null then
   _js:='{"errors": {"error": "error_unauthorized"} }';
   return _js;
end if;

if exists (select 1 from friend f where f.friendId=_friendId and f.userId=_userId) then
   _js:='{"errors": {"error": "error_alreadyfriend"} }';
   return _js;
end if;

if not exists (select 1 from "user" u where u.id=_friendId) then
   _js:='{"errors": {"error": "error_invalidfriend"} }';
   return _js;
end if;


if (select count(*) from friend f where f.userId=_userId)>=20 then
   _js:='{"errors": {"error": "error_toomanyfriends"} }';
   return _js;
end if;

insert into friend(userId, friendId)
select _userId, _friendId;

select json_agg(q) into _js from (
   select u.id::varchar, u.name from "user" u inner join friend f on u.id=f.friendId
      where f.userId=_userId order by u.name limit(20)
) q;

select jsetjson('{}', 'contacts', coalesce(_js, '[]')) into _js;

return _js;


end
$$
language plpgsql;
-----------------------------------------

