# Database server

Database settings and configuration.

## Flyway

Most of the time, you'll use [Flyway][5] to manage the database.

[5]: flyway.md

## Common Commands

You'll need [Task][1] to do anything. You can run `task --list` to see the most common commands, or peek at `tasklist.yml` to see hidden commands.

Look at [common commands][3] in the :lock: devops repo for additional tips and tricks.

[1]: https://taskfile.dev/

### Getting started

1. Make sure the following keys are set in `../.env`.

```
DATABASE_ADMIN_PASSWORD
DATABASE_ADMIN_USER
DATABASE_HOST_DIRECTORY
DATABASE_NAME
```

1. Run `task db:DANGEROUS:wipe-host-data` to delete previous database files in `$DATABASE_HOST_DIRECTORY`, if any.
1. Run `task db:DANGEROUS:initialize`.
1. Run `task up` to start the application stack. You can verify that everything is okay with Postgres by checking the logs with `docker-compose logs -f database`.
1. Connect to the cluster from the host, `task db:psql` (or `psql -h localhost -p $DATABASE_PORT -U $DATABASE_ADMIN_USER -d $DATABASE_NAME`). As with subsequent commands, you will be prompted for `DATABASE_ADMIN_PASSWORD`. You can set up a [`.pgpass` file][4] to bypass the password prompt.
1. Following the instructions in **"Securing the database"** below.
1. Run `rm ~/.psql_history` to clear the client history (which may contain the `DATABASE_ADMIN_PASSWORD`).

[4]: https://www.postgresql.org/docs/13/libpq-pgpass.html

### Securing the database

Refer to [the instructions][2] in the :lock: devops repo.

[2]: https://github.com/alexgs/devops/blob/develop/documentation/postgresql-securing-databases.md

### Backing up the database

Refer to [the instructions][3] in the :lock: devops repo.

[3]: https://github.com/alexgs/devops/blob/develop/documentation/postgresql-common-commands.md
