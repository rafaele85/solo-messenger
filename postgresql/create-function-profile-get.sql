
#select * from ProfileGetJSON(5);

drop function if exists ProfileGetJSON;

create or replace function ProfileGetJSON(userid "user".id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_userid alias for userid;
begin

if _userid is null then
   _js:='{"errors": {"error": "error_unauthorized"} }';
   return _js;
end if;

select row_to_json(q) into _js from (
    select u.name, u.avatar from "user" u where u.id=_userid
) q;

_js := jsetjson('{}', 'profile', _js);

return _js;

end
$$
language plpgsql;
-----------------------------------------
 