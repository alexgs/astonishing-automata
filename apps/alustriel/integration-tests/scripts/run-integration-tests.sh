#!/bin/bash

#
# Copyright 2023-2024 Phillip Gates-Shannon. All rights reserved.
#

# Get the current directory
current_dir=$(pwd)

# Check if the current directory ends with 'apps/arrokoth'
if [[ "$current_dir" != *"apps/arrokoth" ]]; then
    echo "Not running from the \`apps/arrokoth\` directory. Exiting."
    exit 1
fi

# Load env vars
if [ "$CI" != "true" ]; then
  cd ./integration-tests/scripts || exit
  source load-env-vars.sh
  cd "$current_dir" || exit
fi

# Start the integration test environment
./integration-tests/scripts/start-test-env.sh

# Get an access token and run the integration tests
TOKEN=$(./integration-tests/scripts/get-access-token.sh)
export TOKEN
npm run test:int
return_code=$?

# Delete the integration test environment
docker-compose -f ../../docker-compose.integration-tests.yml down --remove-orphans
if [ "$CI" != "true" ]; then
  rm -rf ../../database/integration-tests
fi

# Exit with the return code from the integration tests, so the GitHub action will fail if the tests fail
exit $return_code
