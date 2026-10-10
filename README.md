# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Supabase Authentication

Copy `.env.example` to `.env` and set the Supabase project URL and anon/publishable key from **Project Settings > API**. The custom esbuild development and production scripts load these values from `.env`.

Users can register from the Login dialog; enable email confirmation and configure the Supabase Auth site URL/redirect URLs for the deployed app. Provision the admin account through Supabase Authentication; the browser only opens the admin UI for the configured admin email after password sign-in. Never put a Supabase service-role key in this project or in a browser environment variable.

Registration stores full name, date of birth, city, country, and saved learning technologies in the Supabase user's `user_metadata`; email remains on the auth user. Save the separate Learning form before registration. Passwords are sent only to Supabase Auth and are never added to profile metadata. Signed-in users can view these fields from **Profile**.

## Supabase Authentication

Copy `.env.example` to `.env` and set the Supabase project URL and anon/publishable key from **Project Settings > API**. The custom esbuild development and production scripts load these values from `.env`.

Create user accounts in Supabase Authentication. The browser's email allowlist controls access to the local admin UI; any future server-side publishing or shared storage must enforce authorization with backend policies. Never put a Supabase service-role key in this project or in a browser environment variable.

## Admin Workspace

The separate workspace is available at `/admin`. Its sign-in accepts only `codecomputedeploy@gmail.com`. Provision the account and set its password in Supabase Authentication; do not hard-code credentials in the app. Articles published there appear in the existing public article library. Supporting resources and uploaded files currently use browser-local storage and are not shared across devices or visitors; configure a protected backend and storage bucket before using them as a multi-user publishing system.
