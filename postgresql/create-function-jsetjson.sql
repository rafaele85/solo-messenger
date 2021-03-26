
create or replace function jsetjson(src JSONB, fieldname varchar(100), value jsonb)
returns JSONB
as $$
declare
_js JSONB;
_value alias for value;
begin

if not fieldname like '{%}' then
   fieldname:=concat('{',fieldname,'}');
end if;

_js := jsonb_set(src::jsonb, fieldname::text[], _value::jsonb, true);


return _js;


end
$$
language plpgsql;

---------------