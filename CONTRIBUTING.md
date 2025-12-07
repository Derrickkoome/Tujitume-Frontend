## Contributing & Branching Workflow

This project uses a protected `main` branch and a `dev` integration branch. Feature branches are created off `dev` and named using the `feature/<short-name>` pattern.

- **Branching**
  - Work on features in branches named `feature/<name>` (example: `feature/firebase-auth`).
  - Create feature branches from `dev` (not `main`).

- **Push & PRs**
  - Push your branch: `git push -u origin feature/<name>`
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
git checkout feature/<your-branch>
git merge dev
# resolve conflicts, commit, then
git push
```

- **Commit messages**
  - Use clear messages and include the feature or ticket id when possible.

If you have questions about workflow, ping the Scrum Master (Derrick Koome).
