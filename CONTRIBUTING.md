## Contributing & Branching Workflow

This project uses a protected `main` branch and a `dev` integration branch. Feature branches are created off `dev` and MUST follow the `ft-<featurename>` naming convention.

- **Branching**
  - Work on features in branches named `ft-<featurename>` (example: `ft-firebase-auth`).
  - Create feature branches from `dev` (not `main`).
  - Keep branch names short, lower-case, and use hyphens for separators. Avoid spaces and special characters.

- **Helper script**
  - You can use the `scripts/create-feature.sh` helper to create a correctly named branch from `dev`:

```bash
# Make sure script is executable: chmod +x scripts/create-feature.sh
./scripts/create-feature.sh firebase-auth
# This will create and checkout: ft-firebase-auth
```

- **Push & PRs**
  - Push your branch: `git push -u origin ft-<featurename>`
  - Create a Pull Request targeting `dev` on GitHub.
  - Do not merge directly to `main` — `main` is updated only from stable, reviewed releases.

- **Code Review**
  - At least one team member should review the PR.
  - Ensure CI (build/tests/lint) passes before merging.

- **Keeping branches up to date**
  - Regularly pull latest `dev` into your feature branch:

```bash
git checkout dev
git pull origin dev
git checkout ft/<your-branch>
git merge dev
# resolve conflicts, commit, then
git push
```

- **Commit messages**
  - Use clear messages and include the feature or ticket id when possible.

If you have questions about workflow, ping the Scrum Master (Derrick Koome).
