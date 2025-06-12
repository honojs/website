# Azion Edge Functions

[Azion Edge Functions](https://www.azion.com/en/products/edge-functions/) let you run code at the edge — closer to your users — for faster performance, lower latency, and enhanced scalability. Hono also runs smoothly on Azion’s Edge Platform.

You can build your app locally and deploy it using [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/), which provides simple commands to manage your edge applications.

## 1. Setup

Start a new Hono project using the **azion CLI** command. Select `Hono` preset when prompted.

1. Initialize the project:

```sh
azion init
```

2. Give your project a name, or press enter to accept the given suggestion:

```sh
? Your application's name:  (black-thor)
```

3. Choose the Hono preset:

```sh
? Choose a preset:  [Use arrows to move, type to filter]
  Angular
  Astro
  Docusaurus
  Eleventy
  Emscripten
  Gatsby
  Hexo
> Hono
  Hugo
  Javascript
  ...
```

4. Choose one of the available templates.

5. With the template fetched and configured, you can choose to start a local development server.

```sh
Do you want to start a local development server? (y/N)
```

Move into your project folder and install the dependencies:

::: code-group

```sh [npm]
cd [your-project-name]
npm i
```

```sh [yarn]
cd [your-project-name]
yarn
```

```sh [pnpm]
cd [your-project-name]
pnpm i
```

```sh [bun]
cd [your-project-name]
bun i
```

:::

## 2. Hello World

Edit `src/index.ts`:

```ts
// src/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Azion!'))

export default app
```

## 3. Run Locally

Run the development server and open `http://localhost:3000` in your browser.

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## 4. Deploy

First, using the Azion CLI you will need to log in, if you haven’t done so already. This will authenticate your local environment with your Azion's account.

```sh
azion login
```

Then, deploy your app with:

```sh
azion deploy
```

Wait while the project is built and deployed to the Azion Edge Platform.

> [!NOTE]  
> Once the deployment is triggered, Azion will open the browser and take the user to a page on Azion Console where the deployment logs and process can be monitored. If it doesn’t open automatically, just click on the provided link.

After the deployment is complete, you’ll receive a domain to access your Hono project on the Azion’s platform.

Wait a few minutes so the propagation takes place, and then access your application using the provided domain, which should be similar to `https://xxxxxxx.map.azionedge.net`.

If you don’t have an account yet, [sign up here](https://console.azion.com/signup/).
