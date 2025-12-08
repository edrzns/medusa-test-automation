#!/bin/sh

echo "Starting Medusa setup..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
export PGPASSWORD=medusa_password
until psql -h "postgres" -U "medusa_user" -d "medusa_db" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready"

# Wait for Redis to be ready
echo "Waiting for Redis..."
until redis-cli -h redis ping | grep -q "PONG"; do
  echo "Redis is unavailable - sleeping"
  sleep 2
done

echo "Redis is ready"

# Run database migrations
echo "Running database migrations..."
npx medusa db:migrate

# Seed initial data
echo "Seeding database..."
npm run seed || echo "Seed data not available yet"

# Start Medusa development server
echo "Starting Medusa server..."
npm run dev