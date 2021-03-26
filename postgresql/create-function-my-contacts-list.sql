//MyContactsList

#select * from MyContactsListJSON('9978cd34-e12c-4132-8325-f31f41b3d9fa');

drop function if exists MyContactsListJSON;

create or replace function MyContactsListJSON(sessionkey session.sessionkey%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_sessionkey alias for sessionkey;
_userId "user".id%TYPE;
begin

select s.userId into _userId from session s where s.sessionkey=_sessionkey;
if _userId is null then
   _js:='{"errors": {"error": "error_unauthorized"} }';
   return _js;
end if;

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

