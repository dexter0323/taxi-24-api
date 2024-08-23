#!/bin/bash
set -e

# Start PostgreSQL server in the background
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to start
until pg_isready -h localhost -p 5432; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

# Run the psql command to create the PostGIS extension
psql -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Bring PostgreSQL server to the foreground
wait