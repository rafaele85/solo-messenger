
#select * from ContactGetJSON(5, 6);

drop function if exists ContactGetJSON;

create or replace function ContactGetJSON(contactid "user".id%TYPE, userid "user".id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_userid alias for userid;
_contactid alias for contactid;
_name "user".name%TYPE;
_avatar "user".avatar%TYPE;
_unread int;
begin

if _userid is null then
   _js:='{"errors": {"error": "error_unauthorized"} }';
   return _js;
end if;

select u.name, u.avatar into _name, _avatar
 from friend f inner join "user" u on f.friendId=u.id
where f.userId=_userid and f.friendId=_contactid;

if _name is null then
   _js:='{"errors": {"error": "error_notfriend"} }';
   return _js;
end if;

select count(*) into _unread from message m where m.fromid=_contactid and m.toid=_userid and m.isseen=false;

_js:=jsetstr('{}', 'id', _contactid::varchar);
_js:=jsetstr(_js, 'name', _name);
_js:=jsetstr(_js, 'avatar', coalesce(_avatar, ''));
_js:=jsetint(_js, 'unread', _unread);
_js:=jsetjson('{}', 'contact', _js);

call LOGJSONADD('contactGetJSON', _js);

return _js;

end
$$
language plpgsql;
-----------------------------------------
