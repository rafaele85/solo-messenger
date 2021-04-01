#select * from MessageSendJSON(4, 'test msg', 5);

drop function if exists MessageSendJSON;

create or replace function MessageSendJSON(friendid friend.friendId%TYPE, message message.message%TYPE, userid "user".id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_friendid alias for friendid;
_message alias for message;
_userId alias for userid;
begin

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
 
_js:='{}';

return _js;

end
$$
language plpgsql;
-----------------------------------------
