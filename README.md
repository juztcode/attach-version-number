# Generate semver - Github action

A [GitHub Action](https://github.com/features/actions) to generate semantic version number.
and commit messages.

## Usage

1. Create a `.github/workflows/generate-version.yml` file in your GitHub repo.
2. Add the following code to the `generate-version.yml` file.

```yml
on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    branches:
      - master

jobs:
  attach:
    runs-on: ubuntu-18.04
    timeout-minutes: 10
    if: github.event.pull_request.draft == false

    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Generate branch diff file
        if: success()
        run: |
          echo "Head branch: ${GITHUB_HEAD_REF}"
          echo "Base branch: ${GITHUB_BASE_REF}"
          git log origin/${GITHUB_BASE_REF}..origin/${GITHUB_HEAD_REF} > ./branch-diff.txt

      - name: Extract previous version
        if: success()
        run: |
          export PREVIOUS_VERSION=$(git describe --tags --abbrev=0)
          echo "Previous version: ${PREVIOUS_VERSION}"
          echo "PREVIOUS_VERSION=${TAG}" > ${GITHUB_ENV}

      - name: Generate version number
        id: generate
        if: success()
        uses: juztcode/generate-semver@1.0.0
        with:
          branch-diff-file: ./branch-diff.txt
          previous-version: ${{ env.PREVIOUS_VERSION }}

      - name: Print version
  - if: success()
    run: echo ${{ steps.generate.outputs.generated-version }}
```

> Note: This will be triggered when there are pull requests from release branches to master branch and update pull request body with jira ticket ids.

## Inputs

Input             | Purpose
------------------|---------------------------------------------------------------------------------------------------------------------------------------
branch-diff-file  | File contains commit message difference between head and base branches.
previous-version  | Previous (latest) version number.

## Outputs

Output            | Purpose
------------------|---------------------------------------------------------------------------------------------------------------------------------------
generated-version | Generated semver version number.
