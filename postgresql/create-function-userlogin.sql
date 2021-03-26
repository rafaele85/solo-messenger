
#select * from UserLoginJSON('john', '054e3b308708370ea029dc2ebd1646c498d59d7203c9e1a44cf0484df98e581a', null);

drop function if exists UserLoginJSON;

create or replace function UserLoginJSON(username "user".username%TYPE, hashPassword "user".hashpassword%TYPE, sessionkey session.sessionkey%TYPE)
returns JSONB
as $$
declare
_username alias for username;
_hashpassword alias for hashPassword;
_name user.name%TYPE;
_id user.id%TYPE;
_js JSONB;
_sessionkey alias for sessionkey;
begin


select u.id, u.name into _id, _name from "user" u 
   where u.username=_username and u.hashpassword=_hashpassword;
if _id is null then
   _js:='{"errors": {"error": "error_login_failed"} }';
else
   delete from session where session.userid = _id;
   delete from session where session.sessionkey = _sessionkey;

   _sessionkey:=uuid_generate_v4()::varchar;

   insert into session(userid, sessionkey)
   select _id, _sessionkey;
   
   select row_to_json(q) as auth from (select id::varchar, name, _sessionkey sessionKey from "user" where "user".id = _id) q into _js;
   select jsetjson('{}', 'auth', _js) into _js;
   call LOGJSONADD('signin', _js);
end if;

return _js;

end
$$
language plpgsql;
-----------------------------------------

--{ res: { errors: { username: 'duplicate' }, result: 'Error' } }