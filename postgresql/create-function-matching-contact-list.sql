#select * from MatchingContactsListJSON('1212', 4);

drop function if exists MatchingContactsListJSON;

create or replace function MatchingContactsListJSON(query varchar(40), userid "user".id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_userId alias for userid;
_query varchar(50);
begin

_query:=concat('%',query,'%');

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
