#select * from FriendRequestJSON(5, 6, 'Please add me to your contact list');

drop function if exists FriendRequestJSON;

create or replace function FriendRequestJSON(
  friendid friend.friendId%TYPE,
  userid "user".id%TYPE,
  message message.message%TYPE
)
returns JSONB
as $$
declare
_friendId alias for friendId;
_js JSONB;
_message alias for message;
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

if _friendId=_userId then
    _js:='{"errors": {"error": "error_selffriend"} }';
    return _js;
end if;

if exists (select 1 from friend f where f.userId=_userId and f.friendId=_friendId) then
  _js:='{"errors": {"error": "error_alreadyfriend"} }';
  return _js;
end if;

if exists (select 1 from message m where f.fromid=_userId 
   and f.toid=_friendId and m.messagetype='friendrequest') then
      _js:='{"errors": {"error": "error_alreadyrequested"} }';
      return _js;
end if;

if length(_message)=0 then
  _js:='{"errors": {"error": "error_blankmessage"} }';
  return _js;
end if;

insert into message(fromid, toid, message, messagetype)
select _userid, _friendId, _message, 'frendrequest';

_js:='{}';

return _js;

end
$$
language plpgsql;
-----------------------------------------

