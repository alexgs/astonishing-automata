# Testing

## Integration tests

### Starting a test environment

Normally, the integration tests should be run with the script `apps/alustriel/integration-tests/scripts/run-integration-tests.sh` in an automated CI/CD environment or something similar. For local development (e.g. for writing more tests or debugging existing ones), follow these steps to spin up a test environment.

1. Open a new shell with `zsh` or the like. This will prevent your existing shell from having its environment variables polluted with all of the ones from the integration testing environment.
1. CD into `apps/alustriel/integration-tests/scripts`.
1. Run `source load-env-vars.sh`.
1. `cd ../..` and run `./integration-tests/scripts/start-test-env.sh` to start the Docker services and initialize the database.
1. Finally, you can execute `npm run test:int`.

### Resetting a test environment

These steps will let you destroy or reset a test environment.

1. Start in `apps/alustriel`.
1. Run `docker-compose down --remote-orphans`.
1. Delete the database with `rm -rf ../../database/integration-tests`.

Note that the tests should reset the database before each test is executed, so you shouldn't need to do this very often. You should do it before running the integration tests script locally.
