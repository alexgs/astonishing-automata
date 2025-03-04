#!/bin/bash

#
# Copyright 2023-2024 Phillip Gates-Shannon. All rights reserved.
#

# Get the current directory
current_dir=$(pwd)

# Check if the current directory ends with 'apps/alustriel'
if [[ "$current_dir" != *"apps/alustriel" ]]; then
  echo "Not running from the \`apps/alustriel\` directory. Exiting."
  exit 1
fi

# Load env vars
if [ "$CI" != "true" ]; then
  cd ./integration-tests/scripts || exit
  source load-env-vars.sh
  cd "$current_dir" || exit
fi

# Start Docker Compose stack
docker compose -f ../../docker-compose.integration-tests.yml up -d database
sleep 5

# Initialize database schema
cd ../.. || exit
docker run --rm \
  --network aaa-network \
  -e FLYWAY_PASSWORD="$DATABASE_PASSWORD" \
  -e FLYWAY_URL="jdbc:postgresql://database:5432/$DATABASE_NAME" \
  -e FLYWAY_USER="$DATABASE_USER" \
  -v "$(pwd)/flyway/sql:/flyway/sql" \
  -v "$(pwd)flyway/conf:/flyway/conf" \
  flyway/flyway migrate
cd "$current_dir" || exit
