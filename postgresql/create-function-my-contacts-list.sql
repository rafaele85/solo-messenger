//MyContactsList

#select * from MyContactsListJSON(6);

drop function if exists MyContactsListJSON;

create or replace function MyContactsListJSON(userid "user".id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_userid alias for userid;
begin

if _userid is null then
   _js:='{"errors": {"error": "error_unauthorized"} }';
   return _js;
end if;

select json_agg(q) into _js from (
   select u.id::varchar, u.name, 
   (select count(*) as unread from message m where m.fromid=_userid and m.toid=u.id and m.isseen=false)
    from "user" u inner join friend f on u.id=f.friendId
      where f.userId=_userId order by u.name limit(20)
) q;

select jsetjson('{}', 'contacts', coalesce(_js, '[]')) into _js;

return _js;

end
$$
language plpgsql;
-----------------------------------------

