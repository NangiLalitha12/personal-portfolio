# Project

## Project info

This repository contains a personal portfolio built with modern web tooling.

## How can I edit this code?

There are several ways of editing the application.

1. Use your preferred IDE

	- Clone the repository and push changes using Git.
	- The only requirement is having Node.js & npm installed - see the Node.js or nvm documentation for installation instructions.

	Example:

	```sh
	git clone <YOUR_GIT_URL>
	cd <YOUR_PROJECT_NAME>
	npm install
	npm run dev
	```

2. Edit a file directly in GitHub

	- Navigate to the desired file(s).
	- Click the "Edit" button (pencil icon) at the top right of the file view.
	- Make your changes and commit.

3. Use GitHub Codespaces (optional)

	- From the repository page click the "Code" button and open Codespaces to edit in the cloud.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy this project to any static hosting provider that supports Vite-built sites (for example Vercel, Netlify, or GitHub Pages). Typical steps are:

1. Build the project:

	```sh
	npm run build
	```

2. Deploy the `dist`/`build` output directory according to your host's instructions.

## Custom domain

Most hosting providers support custom domains; follow your hosting provider's documentation to connect a domain to the deployed site.
