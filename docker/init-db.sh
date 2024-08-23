#!/bin/bash
set -e

echo "Starting PostgreSQL server in the background..."
docker-entrypoint.sh postgres &

echo "Waiting for PostgreSQL to start..."
until pg_isready -h localhost -p 5432; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

echo "PostgreSQL is ready. Creating PostGIS extension..."
psql -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS postgis;"

echo "PostGIS extension created. Bringing PostgreSQL server to the foreground..."
wait