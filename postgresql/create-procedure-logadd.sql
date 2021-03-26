drop procedure if exists LOGADD;

create or replace procedure LOGADD(str varchar(500))
as $$
begin
insert into log(str)
select str;
end
$$
language plpgsql;
