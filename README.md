# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


1. Post Gig Page UI

Clean, modern UI built with responsive layout principles.

Input fields:

Title

Description

Category

Pricing / Budget

Delivery Time

Attachments (optional)

Reusable components where possible.

2. Form Validation

Required fields validated before submission.

Real-time validation messages.

Disabled submit button until form is valid.

Validation handled using:

Frontend schema (e.g., Zod / Yup) or

Manual custom validation.

3. POST /gigs API Integration

Fully connected to backend endpoint:

POST /gigs
Content-Type: application/json


Handles:

Loading state

Error handling

Success response

Sends sanitized user data only.

4. Toast Notifications

Success toast on gig creation.

Error toast on failed submission.

Non-intrusive UI placement.

Toast auto-dismiss and accessible for screen readers.

5. UI/UX Styling

Uses consistent component styling from project design system.

Features:

Clean spacing

Proper visual hierarchy

Mobile responsiveness

Form-focused layout

Aims for a premium, intuitive user experience.