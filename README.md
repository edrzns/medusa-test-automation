# Medusa Test Automation

Automated testing framework for Medusa e-commerce platform showcasing SDET skills.

## Prerequisites

- Docker
- Node.js 20
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