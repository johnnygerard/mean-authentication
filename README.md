# AuthMEAN

![project status](https://img.shields.io/badge/project_status-inactive-lightgray?style=for-the-badge)

This project provides a reusable authentication system for applications built on
the [MEAN stack](https://www.mongodb.com/resources/languages/mean-stack).

[![live demo](https://img.shields.io/badge/live_demo-blue?style=for-the-badge)](https://mean-authentication.app.jgerard.dev/)

Warning: Because the API server sleeps after 30 minutes of inactivity
(see [Dyno Sleeping](https://devcenter.heroku.com/articles/eco-dyno-hours#dyno-sleeping)),
you may experience a few seconds of delay on the first API request.

## Tech Stack & Architecture

[TypeScript](https://www.typescriptlang.org/) is used across the full stack.

### Frontend

- **Framework**: [Angular](https://angular.dev/)
- **UI Library**: [Angular Material](https://material.angular.io/)
- **Style**: [Sass](https://sass-lang.com/)

### Backend

- **CDN**: Static assets delivered through [Vercel Edge Network](https://vercel.com/docs/edge-network/overview).
- **API Server**: Powered by [Express](https://expressjs.com/) and hosted on [Heroku](https://www.heroku.com/).
- **Database**: User data stored in [MongoDB Atlas](https://www.mongodb.com/atlas).
- **Cache**: Session data managed by [Redis Cloud](https://redis.io/cloud/).

## Features

### High-Level

- User login/registration with username and password
- Logout and session revocation
- Password update
- Account deletion with password confirmation

### Password

- Strength validation with [zxcvbn](https://github.com/dropbox/zxcvbn?tab=readme-ov-file#readme)
- [Argon2](https://github.com/P-H-C/phc-winner-argon2?tab=readme-ov-file#readme) hashing algorithm
- [Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords) validation

### Security

- Session authentication with encrypted cookies
- Session data stored in Redis Cloud
- CSRF protection using
  the [synchronizer token pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)
- Rate limiting with [express-rate-limit](https://express-rate-limit.mintlify.app/overview)

### Performance

- [Prerendering (SSG)](https://angular.dev/guide/prerendering)
- Lazy-loaded components
- `OnPush` change detection strategy
- Worker threads for CPU-intensive tasks

### Testing

- Server-side testing with [Node.js test runner](https://nodejs.org/api/test.html#test-runner)
- [Playwright](https://playwright.dev/) end-to-end testing
- Test data generated by [Faker](https://fakerjs.dev/)

## Version Requirements

- Angular 18
- Node.js 22
- Express 4
- MongoDB Atlas 7
- Redis Stack 7.4

## Lighthouse Reports

Version audited: v0.19.0

- [Home page](https://googlechrome.github.io/lighthouse/viewer/?gist=c57216d3b70a42c74d21b6bccc66a57b)
- [Registration page](https://googlechrome.github.io/lighthouse/viewer/?gist=a8c3b920ce36abfc5973bd60459409cc)
- [Login page](https://googlechrome.github.io/lighthouse/viewer/?gist=5cff44991036ae26c29fd741bc6ec5e2)

## Dev Environment & Tools

- System: [Ubuntu](https://ubuntu.com/desktop)
- IDE: [WebStorm](https://www.jetbrains.com/webstorm/)
- Formatter: [Prettier](https://prettier.io/)
- Linter: [ESLint](https://eslint.org/)
- AI assistant: [GitHub Copilot](https://github.com/features/copilot)

## Screenshots

### Registration Page

![registration page](docs/screenshots/registration-page.avif)

### Login Page

![login page](docs/screenshots/login-page.avif)

## Credits

- Password strength meter design derived
  from [Memorisely : Password Challenge](https://www.figma.com/community/file/1332443075558142445/memorisely-password-challenge)
  by [Adil D](https://www.figma.com/@adildahmani)

## Copyright

© 2024 Johnny Gérard
