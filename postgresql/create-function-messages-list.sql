#select * from MessagesListJSON(4, '3eb1f521-4639-40a9-a85f-3a62a8bc3d63');

drop function if exists MessagesListJSON;

create or replace function MessagesListJSON(friendId friend.friendId%TYPE, sessionkey session.sessionkey%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_friendId alias for friendId;
_sessionkey alias for sessionkey;
_userId "user".id%TYPE;
begin

select s.userId into _userId from session s where s.sessionkey=_sessionkey;
if _userId is null then
  _js:='{"errors": {"error": "error_unauthorized"} }';
  return _js;
end if;


select json_agg(q) into _js from (
   select fu.name "from", tu.name "to", m.message, m.createdat from message m 
   inner join "user" fu on m.fromid=fu.id
   inner join "user" tu on m.toid=tu.id
   where (m.fromid=_userId and m.toId=_friendId or 
          m.fromid=_friendId and m.toId=_userId )
   order by m.createdat limit(20)
) q;     

select jsetjson('{}', 'messages', coalesce(_js, '[]')) into _js;
return _js;

end
$$
language plpgsql;
-----------------------------------------
