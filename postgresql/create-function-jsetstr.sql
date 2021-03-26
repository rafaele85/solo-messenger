
-----

create or replace function jsetstr(src JSONB, fieldname text, value text)
returns JSONB
as $$
declare
_js JSONB;
_value JSONB;
begin


if not fieldname like '{%}' then
   fieldname:=concat('{',fieldname,'}');
end if;

_value := to_jsonb(value);

_js := jsonb_set(src::jsonb, fieldname::text[], _value, true);

return _js;


end
$$
language plpgsql;
------
