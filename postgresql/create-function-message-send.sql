#select * from MessageSendJSON(4, 'test msg', '3eb1f521-4639-40a9-a85f-3a62a8bc3d63');

drop function if exists MessageSendJSON;

create or replace function MessageSendJSON(friendId friend.friendId%TYPE, message message.message%TYPE, sessionkey session.sessionkey%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_friendId alias for friendId;
_message alias for message;
_sessionkey alias for sessionkey;
_tosessionkey alias for sessionkey;
_userId "user".id%TYPE;
begin

select s.userId into _userId from session s where s.sessionkey=_sessionkey;
if _userId is null then
  _js:='{"errors": {"error": "error_unauthorized"} }';
  return _js;
end if;

if not exists (select 1 from friend f where f.userId=_userId and f.friendId=_friendId) then
  _js:='{"errors": {"error": "error_unknownfriend"} }';
  return _js;
end if;

if length(_message)=0 then
  _js:='{"errors": {"error": "error_blankmessage"} }';
  return _js;
end if;

insert into message(fromid, toid, message)
select _userid, _friendId, _message;

select json_agg(q) into _js from (
   select fu.name "from", tu.name "to", m.message, m.createdat from message m 
   inner join "user" fu on m.fromid=fu.id
   inner join "user" tu on m.toid=tu.id
   where (m.fromid=_userId and m.toId=_friendId or 
          m.fromid=_friendId and m.toId=_userId )
   order by m.createdat limit(20)
) q;    

select jsetjson('{}', 'messages', coalesce(_js, '[]')) into _js;

select s.sessionkey into _tosessionkey from session s where s.userId = _friendId;
if _tosessionkey is not null then
   select jsetstr(_js, 'tosession', _tosessionkey) into _js;
end if;

select jsetjson('{}', 'result', _js) into _js;

return _js;

end
$$
language plpgsql;
-----------------------------------------
