# Create-hono

Command-line options supported by `create-hono` - the project initializer that runs when you run `npm create hono@latest`, `npx create-hono@latest`, or `pnpm create hono@latest`.

> [!NOTE]
> **Why this page?** The installation / quick-start examples often show a minimal `npm create hono@latest my-app` command. `create-hono` supports several useful flags you can pass to automate and customize project creation (select templates, skip prompts, pick a package manager, use local cache, and more).

## Passing arguments:

When you use `npm create` (or `npx`) arguments intended for the initializer script must be placed **after** `--`. Anything after `--` is forwarded to the initializer.

::: code-group

```sh [npm]
# Forwarding arguments to create-hono (npm requires `--`)
npm create hono@latest my-app -- --template cloudflare-workers
```

```sh [yarn]
# "--template cloudflare-workers" selects the Cloudflare Workers template
yarn create hono my-app --template cloudflare-workers
```

```sh [pnpm]
# "--template cloudflare-workers" selects the Cloudflare Workers template
pnpm create hono@latest my-app --template cloudflare-workers
```

```sh [bun]
# "--template cloudflare-workers" selects the Cloudflare Workers template
bun create hono@latest my-app --template cloudflare-workers
```

```sh [deno]
# "--template cloudflare-workers" selects the Cloudflare Workers template
deno init --npm hono@latest my-app --template cloudflare-workers
```

:::

## Commonly used arguments

| Argument                | Description                                                                                                                                      | Example                         |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `--template <template>` | Select a starter template and skip the interactive template prompt. Templates may include names like `bun`, `cloudflare-workers`, `vercel`, etc. | `--template cloudflare-workers` |
| `--install`             | Automatically install dependencies after the template is created.                                                                                | `--install`                     |
| `--pm <packageManager>` | Specify which package manager to run when installing dependencies. Common values: `npm`, `pnpm`, `yarn`.                                         | `--pm pnpm`                     |
| `--offline`             | Use the local cache/templates instead of fetching the latest remote templates. Useful for offline environments or deterministic local runs.      | `--offline`                     |

> [!NOTE]
> The exact set of templates and available options is maintained by the `create-hono` project. This docs page summarizes the most-used flags — see the linked repository below for the full, authoritative reference.

## Example flows

### Minimal, interactive

```bash
npm create hono@latest my-app
```

This prompts you for template and options.

### Non-interactive, pick template and package manager

```bash
npm create hono@latest my-app -- --template vercel --pm npm --install
```

This creates `my-app` using the `vercel` template, installs dependencies using `npm`, and skips the interactive prompts.

### Use offline cache (no network)

```bash
pnpm create hono@latest my-app --template deno --offline
```

## Troubleshooting & tips

- If an option appears not to be recognized, make sure you're forwarding it with `--` when using `npm create` / `npx` .
- To see the most current list of templates and flags, consult the `create-hono` repository or run the initializer locally and follow its help output.

## Links & references

- `create-hono` repository : [create-hono](https://github.com/honojs/create-hono)
