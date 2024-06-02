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

This project uses `black` and `isort` to format the code. To run these tools, use the following commands:

```shell
poetry run black .
poetry run isort .
```

This project uses `flake8` to lint the code. To run this tool, use the following command:

```shell
poetry run flake8 .
```

This project uses `mypy` to type check the code. To run this tool, use the following command:

```shell
poetry run mypy .
```

To debug these, see the [IDE](IDE.md) section or just a a run configuration that executes poetry run and then debug it.

# Pre-Commit Setup

This project uses `pre-commit` to run the above tools before each commit. To install `pre-commit`, use the following
command:

```shell
poetry add pre-commit
poetry shell
pre-commit install
```

# Pre-Commit Update

To update the pre-commit hooks, use the following command:

```shell
pre-commit autoupdate
```

_NOTE: This will update the `.pre-commit-config.yaml` file. Remember to update the `pyproject.toml` versions._

_NOTE: This project now uses `pre-commit` dependencies directly from the associated `pyproject.toml` file. This means
that the `pre-commit autoupdate` command is probably not needed._

# Manually Running Pre-Commit

To manually run the pre-commit hooks, use the following command:

```shell
pre-commit run --all-files
```

**WARNING**: When running these manually sometimes a file will be flagged that `git commit` will not flag. This is
because the `git` invocation only checks the _staged_ files, whereas running this command will check all files.

To run one of the tools use:

```shell
pre-commit run mypy --all-files
```

# Check Scripts

This project uses `check` scripts to implement custom code quality checks. To run these tools, use the following
commands:

```shell
python -m scripts.check_commit_msg .git/COMMIT_EDITMSG
python -m scripts.check_copyright ./users/admin.py
```

# Python Environment

## Errors

```shell
ModuleNotFoundError: No module named '_lzma'
```

On MacOS is fixed by:

```shell
brew install xz
pyenv uninstall 3.11
pyenv install 3.11
```
