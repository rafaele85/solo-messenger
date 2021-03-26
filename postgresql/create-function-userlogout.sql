#select * from userLogoutJSON('725e3a21-39ce-4f7a-ba26-016e546ffb1f');


drop function if exists userLogoutJSON;

create or replace function userLogoutJSON(sessionkey session.sessionkey%TYPE)
returns JSONB
as $$
declare
_sessionkey alias for sessionkey;
_js JSONB;
begin

delete from session s where s.sessionkey=_sessionkey;

_js:=concat('{"session": "',_sessionkey,'"}');

return _js;

end
$$
language plpgsql;
------



