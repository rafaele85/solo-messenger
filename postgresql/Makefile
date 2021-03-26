runpostgres := ./run-postgres.bat

buildpostgres:	
#	$(runpostgres) create-table-localization.sql
#	$(runpostgres) create-procedure-localizationadd.sql
#	$(runpostgres) create-function-localization-get.sql
#	$(runpostgres) localization-fill.sql
    $(runpostgres) create-table-log.sql
	$(runpostgres) create-procedure-logadd.sql
	$(runpostgres) create-procedure-logaddjson.sql
	$(runpostgres) create-table-user.sql
	$(runpostgres) create-table-message.sql
	$(runpostgres) create-table-session.sql
	$(runpostgres) create-table-friend.sql
	$(runpostgres) create-function-jsetstr.sql
	$(runpostgres) create-function-jsetjson.sql
	$(runpostgres) create-function-errsjson.sql
	$(runpostgres) create-function-successwithjson.sql
	$(runpostgres) create-function-errsjson.sql
	$(runpostgres) create-function-userlogin.sql
	$(runpostgres) create-function-userlogout.sql
	$(runpostgres) create-function-usersignup.sql
	$(runpostgres) create-function-my-contacts-list.sql
	$(runpostgres) create-function-matching-contact-list.sql

all: buildpostgres

