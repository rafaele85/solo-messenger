create or replace function jsetint(src JSONB, fieldname varchar(100), value bigint)
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

_js := jsonb_set(src::jsonb, fieldname::text[], _value::jsonb, true);


return _js;


end
$$
language plpgsql;
