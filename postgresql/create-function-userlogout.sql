#select * from userLogoutJSON(4);


drop function if exists userLogoutJSON;

create or replace function userLogoutJSON(userid "user".id%TYPE)
returns JSONB
as $$
declare
_userid alias for userid;
_js JSONB;
begin

select to_jsonb( array_agg(f.friendid) ) into _js from friend f 
   where f.userId = _userid;

select jsetjson('{}', 'friendids', _js) into _js;

return _js;

end
$$
language plpgsql;
------



