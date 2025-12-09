## Design Decisions

### Why Simple Helpers Instead of Builder Pattern?

Initially considered implementing the Builder pattern for test data,
but decided against it because:
- Adds complexity that isn't needed for this scope
- Helper functions are more maintainable for this project size
- Easier for others to understand and contribute
- Can refactor to patterns later if project grows