# Testing Policy

## 1. Tests are required for:
- Any logic change
- Any bug fix
- Any rule modification

## 2. Tests must:
- Cover edge cases
- Be deterministic
- Avoid real external network calls

## 3. Test Levels

- Unit — required for logic
- Integration — optional
- E2E (Playwright) — for user flows

## 4. Commit Rule

Code without tests is not complete.