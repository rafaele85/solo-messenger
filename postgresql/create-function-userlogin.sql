
#select * from UserLoginJSON('john', '054e3b308708370ea029dc2ebd1646c498d59d7203c9e1a44cf0484df98e581a');

drop function if exists UserLoginJSON;

create or replace function UserLoginJSON(username "user".username%TYPE, hashPassword "user".hashpassword%TYPE)
returns JSONB
as $$
declare
_username alias for username;
_hashpassword alias for hashPassword;
_name user.name%TYPE;
_id user.id%TYPE;
_js JSONB;
begin


select u.id  into _id from "user" u 
   where u.username=_username and u.hashpassword=_hashpassword;
if _id is null then
   _js:='{"errors": {"error": "error_login_failed"} }';
   return _js;
end if;   

select to_jsonb( array_agg(f.friendid) ) into _js from friend f 
   where f.userid = _id;

select jsetjson('{}', 'contactids', _js) into _js;
select jsetstr(_js, 'userid', _id::varchar) into _js;

return _js;

end
$$
language plpgsql;
-----------------------------------------

--{ res: { errors: { username: 'duplicate' }, result: 'Error' } }