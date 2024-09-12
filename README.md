# AuthMEAN

![project status](https://img.shields.io/badge/project_status-active_development-green?style=for-the-badge)

This project provides a reusable authentication system for applications built on the [MEAN stack](https://www.mongodb.com/resources/languages/mean-stack).

## Tech Stack

### Frontend

- [Angular 18](https://blog.angular.dev/angular-v18-is-now-available-e79d5ac0affe)
- [Angular Material](https://material.angular.io/)
- [Sass](https://sass-lang.com/)

### Backend

- Angular static assets served by [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [Express](https://expressjs.com/) API server hosted on [Heroku](https://www.heroku.com/) platform
- Data stored in a [MongoDB](https://www.mongodb.com/) cluster managed by [MongoDB Atlas](https://www.mongodb.com/atlas)

Note: The API server sleeps after 30 minutes of inactivity (see [Dyno Sleeping](https://devcenter.heroku.com/articles/eco-dyno-hours#dyno-sleeping)).

## Key Features

### Security

- Username and password authentication
- Password strength validation with [zxcvbn](https://github.com/dropbox/zxcvbn?tab=readme-ov-file#readme)
- Password hashing using [Argon2](https://github.com/P-H-C/phc-winner-argon2?tab=readme-ov-file#readme) algorithm
- Cookie-based server-side session authentication
- CSRF protection using the [synchronizer token pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)
- Rate limiting with [express-rate-limit](https://express-rate-limit.mintlify.app/overview)

### Angular Performance

- [Prerendering (SSG)](https://angular.dev/guide/prerendering)
- Lazy-loaded components
- `OnPush` change detection strategy

### Testing

- [Jasmine](https://jasmine.github.io/) unit and integration testing
- [Cypress](https://www.cypress.io/) end-to-end testing
- Test data generated by [Faker](https://fakerjs.dev/)

### Other

- CORS-enabled REST API

## Screenshots

### Registration Form

![Registration Form](./screenshots/registration-form.avif)

## Dev Environment & Tools

- System: [Ubuntu](https://ubuntu.com/)
- IDE: [WebStorm](https://www.jetbrains.com/webstorm/)
- Formatter: [Prettier](https://prettier.io/)
- Linter: [ESLint](https://eslint.org/)
- AI assistant: [GitHub Copilot](https://github.com/features/copilot)

## Copyright

© 2024 Johnny Gérard
