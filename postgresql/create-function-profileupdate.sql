#name, hashPassword, hashConfirmPassword, avartarSrc, userid

#select  * from profileupdatejson('{"name": "john", "hashpassword": "054e3b308708370ea029dc2ebd1646c498d59d7203c9e1a44cf0484df98e581a", "hashconfirmpassword": "054e3b308708370ea029dc2ebd1646c498d59d7203c9e1a44cf0484df98e581a", "avatar": "./uploads/5043a10deb570c47061df157888a38c1", "userid": 8}' );


drop function if exists ProfileUpdateJSON;


create or replace function ProfileUpdateJSON( params JSONB )
returns JSONB
as $$
declare
_name "user".name%TYPE;
_hashpassword "user".hashPassword%TYPE;
_hashConfirmpassword "user".hashPassword%TYPE;
_avatar "user".avatar%TYPE;
_userid "user".id%TYPE;
prevavatar "user".avatar%TYPE;
_js JSONB;
begin

call LOGJSONADD('ProfileUpdateJSON', params);

select params->>'name' into _name;
select params->>'hashpassword' into _hashpassword;
select params->>'hashconfirmpassword' into _hashconfirmpassword;
select params->>'avatar' into _avatar;
select params->>'userid' into _userid;

if _userid is null then
   _js:='{"errors": {"error": "error_unauthorized"} }';
   return _js;
end if;
 
if _name is null or length(_name)<3 or 
    _hashPassword is null or length(_hashPassword)<8 or
    _hashConfirmPassword!=_hashPassword then
  _js:='{"errors": {"error": "error_profileupdate_failed"} }';
  return _js;
end if;

select u.avatar into prevavatar from "user" u where u.id=_userid;

update "user" set name=_name, hashpassword=_hashpassword, avatar=_avatar
where id=_userid;
 
select to_jsonb( array_agg(f.friendid) ) into _js from friend f 
   where f.userid = _userid;

_js:=jsetjson('{}', 'contactids', coalesce(_js, '[]'));
_js:=jsetstr(_js, 'prevavatar', coalesce(prevavatar, '') );



return _js;

end
$$
language plpgsql;
-----------------------------------------

