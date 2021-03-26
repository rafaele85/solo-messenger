drop procedure if exists localizationAdd;

create or replace procedure localizationAdd(
    tier localization.tier%TYPE,
    category localization.category%TYPE,
    resource localization.resource%TYPE,
    value_en localization.value%TYPE,
    value_ru localization.value%TYPE
)
as $$
declare
_tier alias for tier;
_category alias for category;
_resource alias for resource;
begin

delete from localization l where l.category=_category and l.resource=_resource;

insert into localization(tier, category, resource, lang, value)
select _tier, _resource, _resource, 'en', value_en;

insert into localization(tier, category, resource, lang, value)
select _tier, _resource, _resource, 'ru', value_ru;


end
$$
language plpgsql;
------
