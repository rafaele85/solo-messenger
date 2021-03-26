#select * from MatchingContactsListJSON('1212','4d77f9ba-4571-4ec3-95aa-018efabf78ac');

drop function if exists MatchingContactsListJSON;

create or replace function MatchingContactsListJSON(query varchar(40), sessionkey session.sessionkey%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_sessionkey alias for sessionkey;
_userId "user".id%TYPE;
_query varchar(50);
begin

_query:=concat('%',query,'%');

select s.userId into _userId from session s where s.sessionkey=_sessionkey;
if _userId is null then
  _js:='{"errors": {"error": "error_unauthorized"} }';
  return _js;
end if;

select json_agg(q) into _js from (
   select u.id::varchar, u.name from "user" u
   where u.name like _query
   and u.id<>_userId
   and not exists (select 1 from friend f1 where f1.friendId=u.id and f1.userId=_userId)
   order by u.name limit(20)
) q;     

select jsetjson('{}', 'contacts', coalesce(_js, '[]')) into _js;
return _js;

end
$$
language plpgsql;
-----------------------------------------
