drop function if exists localizationGet;
-----

create or replace function localizationGet(
    category localization.category%TYPE,
    resource localization.resource%TYPE,
    lang localization.lang%TYPE
)
returns text
as $$
declare
_category alias for category;
_resource alias for resource;
_lang alias for lang;
_value localization.value%TYPE;
begin

select l.value into _value from localization l where l.category=_category
and l.resource=_resource and l.lang=_lang;

if _value is not null then
   return _value;
end if;

select l.value into _value from localization l where l.category='general'
   and l.resource=_resource and l.lang=_lang;
if _value is not null then
   return _value;
end if;

select l.value into _value from localization l where l.category=_category
    and l.resource=_resource and l.lang='en';
if _value is not null then
   return _value;
end if;

select l.value into _value from localization l where l.category='general'
    and l.resource=_resource and l.lang='en';
if _value is not null then
   return _value;
end if;

return _resource;

end
$$
language plpgsql;
------

