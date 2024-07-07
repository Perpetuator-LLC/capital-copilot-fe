# Concepts

## CLI First

This project uses a CLI first approach. The CLI is the primary interface for the user. After that IDEs etc. are used for
development, but you must be able to run any code generation or manipulation from the CLI.

# Git Commits

## Generating new Versions

Update version in pyproject.toml.

```shell
sed -i '' 's/^version = ".*"/version = "50.1.0"/' ./pyproject.toml
grep '^version = ' ./pyproject.toml
```

Update the changelog:

```shell
./scripts/update_changelog.py stage 
```

_NOTE: The `stage` argument is used to access AI to summarize changes. It has no effect on the changelog._

Add the Git tag and push it to the repository.

```shell
git commit -m "Bump version to 50.1.0"
git push origin feat/new-feature
git tag -a v50.1.0 -m "Adds new feature A and new feature B. Fixes bug C."
git push origin v50.1.0
```

Now open a pull request to merge it.

## Commit Message Format

Follow https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

- feat: (new feature for the user, not a new feature for build script)
- fix: (bug fix for the user, not a fix to a build script)
- docs: (changes to the documentation)
- style: (formatting, missing semi colons, etc; no production code change)
- refactor: (refactoring production code, e.g. renaming a variable)
- test: (adding missing tests, refactoring tests; no production code change)
- chore: (updating grunt tasks etc; no production code change)

# Code Quality

...TBD
