# Development Workflow

## 1. Stages

Every change follows:

1) Spec (if needed)
2) Plan (3–7 steps)
3) Code
4) Tests
5) Check script
6) Update CHANGELOG

## 2. Commit Format

Each commit must be small and atomic:

- feat: add calculation rule X
- fix: correct edge case for Y
- refactor: extract service Z
- test: add tests for X

Do not mix multiple logical changes.

## 3. What is "small change"?

- One behavior
- One module
- One bug
- One refactor unit

If description requires "and" — split commit.

## 4. Definition of Done

Change is done when:
- Code implemented
- Tests added/updated
- check script passes
- CHANGELOG updated