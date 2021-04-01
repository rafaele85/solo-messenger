#select * from MessagesListJSON(4, 5);

drop function if exists MessagesListJSON;

create or replace function MessagesListJSON(friendid friend.friendId%TYPE, userid "user".id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_friendid alias for friendid;
_userid alias for userid;
begin

if _userId is null then
  _js:='{"errors": {"error": "error_unauthorized"} }';
  return _js;
end if;


select json_agg(q) into _js from (
   select fu.name "from", tu.name "to", m.id::varchar, m.message, m.createdat from message m 
   inner join "user" fu on m.fromid=fu.id
   inner join "user" tu on m.toid=tu.id
   where (m.fromid=_userId and m.toId=_friendId or 
          m.fromid=_friendId and m.toId=_userId )
   order by m.createdat desc limit(20)
) q;     

select jsetjson('{}', 'messages', coalesce(_js, '[]')) into _js;
return _js;

end
$$
language plpgsql;
-----------------------------------------
