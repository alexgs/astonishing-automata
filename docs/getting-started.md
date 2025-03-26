# Getting Started with Local Development

1. Create `/.env` based on the following template. Some of these values will get filled in later; others you will need to look up yourself.

```dotenv
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_ADMIN_PASSWORD=
DATABASE_ADMIN_USER=
DATABASE_HOST=
DATABASE_HOST_DIRECTORY=
DATABASE_NAME=
DATABASE_PORT=
DATABASE_PASSWORD=
DATABASE_USER=

DOCKER_HOST_ADDRESS=host.docker.internal

FLYWAY_DB_HOST=host.docker.internal

FONTAWESOME_NPM_AUTH_TOKEN=

TRAEFIK_DASHBOARD_PORT=8080

VITE_ENABLE_ROUTER_DEVTOOLS=false

DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
```

2. Symlink the `.env` file for Alustriel
    1. `cd apps/alustriel`
    2. `ln -s ../../.env .env`

3. Edit `/etc/hosts` to include the following line:

```plaintext
# Automata
127.0.0.1    automata.local
127.0.0.1    api.automata.local
127.0.0.1    app.automata.local
```

4. Use [mkcert][1] to generate SSL certificates for the local dev domains.
    1. Run `brew install mkcert` to install mkcert. You may need to do `mkcert -install` if this is your first time using mkcert
   2. `cd traefik/etc`
   3. `mkcert automata.local api.automata.local app.automata.local`

[1]: https://mkcert.dev/

5. Start the stack with `task up`, then spin up Alustriel and Bruenor.
