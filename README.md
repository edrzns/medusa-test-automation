# Medusa Test Automation

Automated testing framework for Medusa e-commerce platform showcasing SDET skills.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Node.js LTS
- Git

## Quick Start
```bash
# Clone the repository
git clone https://github.com/edrzns/medusa-test-automation
cd medusa-test-automation

# Start everything
npm run setup

# Check services are running
npm run docker:ps

# View logs
npm run docker:logs
```

## Project Status

- [x] Docker environment setup
- [ ] API test framework
- [ ] E2E test framework
- [ ] CI/CD integration

## Architecture
```
docker/
  ├── docker-compose.yml    # Service orchestration
  └── medusa/
      ├── Dockerfile        # Medusa container build
      └── start.sh          # Container startup script
tests/
  ├── api/                  # API tests (coming soon)
  └── e2e/                  # E2E tests (coming soon)
```

## Development

See [docs/](docs/) for detailed documentation.

## Known Issues & Solutions

### SSL Connection Errors During Migration

**Issue:** Medusa migrations fail with "The server does not support SSL connections"

**Root Cause:** PostgreSQL in Docker doesn't enable SSL by default, but Medusa's database client attempts SSL connections.

**Solution:** Disable SSL in `docker/medusa/medusa-config.ts`:
```typescript
export default defineConfig({
  projectConfig: {
    databaseDriverOptions: {
      connection: { ssl: false }
    }
  }
})
```

**Why this matters:** Shows you document blockers for future developers (recruiters love this).
