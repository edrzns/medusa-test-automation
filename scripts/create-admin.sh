#!/bin/bash

# Create admin user in running Medusa container
docker exec medusa_backend npx medusa user --email admin@test.com --password supersecret

echo "Admin user created: admin@test.com / supersecret"