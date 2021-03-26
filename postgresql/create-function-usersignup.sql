
drop function if exists UserSignupJSON;

create or replace function UserSignupJSON(
  name "user".name%TYPE, 
  username "user".username%TYPE, 
  hashPassword "user".hashpassword%TYPE, 
  hashConfirmPassword "user".hashpassword%TYPE, 
  sessionkey session.sessionkey%TYPE
)
returns JSONB
as $$
declare
_name alias for name;
_username alias for username;
_hashpassword alias for hashPassword;
_hashConfirmpassword alias for hashConfirmPassword;
_sessionkey alias for sessionkey;
_id user.id%TYPE;
_js JSONB;
begin

if _name is null or length(_name)<3 or _username is null or length(_username)<3
    or hashPassword is null or length(hashPassword)<8 or 
    hashConfirmPassword!=hashPassword then
  _js:='{"errors": {"error": "error_signup_failed"} }';
  return _js;
end if;

if exists ( select 1 from "user" u where u.username=_username ) then
  
  _js:='{"errors": {"username": "error_duplicate_username"} }';
  return _js;
end if;

insert into "user"(username, name, hashpassword)
select _username, _name, _hashpassword
returning id into _id;

delete from session where session.sessionkey = _sessionkey;

_sessionkey:=uuid_generate_v4()::varchar;
insert into session(userid, sessionkey)
select _id, _sessionkey;
select row_to_json(q) as auth from (select name, _sessionkey sessionKey) q into _js;
select jsetjson('{}', 'auth', _js) into _js;

return _js;

end
$$
language plpgsql;
-----------------------------------------

