Always use `pnpm` to install dependencies and run scripts. Do not use `npm` or `yarn` as they may cause issues with the lockfile and dependency resolution.

Never remove existing comments unless you are sure they are no longer relevant. Comments often contain important information about the code and its intended behavior.

When adding new code, make sure to include comments that explain the purpose and functionality of the code. This will help other developers understand your code and maintain it in the future.

After any edits:

- run `pnpm lint` to check for any linting errors, iterate and fix them until there are no errors. This will help maintain code quality and consistency across the project.
- run `pnpm build` to ensure that the code compiles correctly and there are no build errors. This will help catch any issues early on and prevent them from affecting the production environment.
