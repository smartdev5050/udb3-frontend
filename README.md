# udb3-frontend

## Environment Variables

Copy the `.env.example` and rename it to `.env.local`.
Fill in the correct values for the variables.
For running it in combination with [udb3-backend](https://github.com/cultuurnet/udb3-backend) on [Docker](https://www.docker.com),
a sample `.env` is available in [appconfig](https://github.com/cultuurnet/appconfig/blob/main/files/udb3/docker/udb3-frontend/.env).

## Build Setup

```bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```

For detailed explanation on how things work, check out [Next.js docs](https://nextjs.org/docs/getting-started).

## Storybook

```bash
$ yarn storybook
```
