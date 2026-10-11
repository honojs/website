# Hono CLI

Hono CLI (`hono`) is a command-line tool for Hono, made for coding agents. It loads your Hono app directly, so an agent can inspect and test the app without starting a server. Commands print JSON by default. `routes`, `request`, `benchmark`, and `ssg` take `--plain` when a human reads the output.

## Installation

Install it in your project. Coding agents find it in `package.json`.

```sh
npm install -D @hono/cli
```

Or globally:

```sh
npm install -g @hono/cli
```

## Output

Commands print JSON to stdout. `snapshot` prints batch JSONL lines instead.

- Success: `{ "ok": true, "data": ... }` with exit code 0
- Failure: `{ "ok": false, "error": { "code", "message", "suggestions", "docs" } }` with exit code 1

On failure, `error.suggestions` says what to try next, and `error.docs` points to a page on this site. Logs go to stderr.

`hono --help` starts with a short note for coding agents, and `hono <command> --help` has examples and notes for each command. An agent needs nothing else to use the CLI.

## Commands

| Command                      | What it does                                           |
| ---------------------------- | ------------------------------------------------------ |
| `hono routes [file]`         | Show routes of your Hono app                           |
| `hono request [path] [file]` | Send a request to your app using `app.request()`       |
| `hono batch <source> [file]` | Run multiple requests from JSONL using `app.request()` |
| `hono snapshot [file]`       | Print the current behavior as batch JSONL lines        |
| `hono diff`                  | Show what your uncommitted changes change              |
| `hono benchmark [file]`      | Measure the performance of your Hono app               |
| `hono ssg [file]`            | Generate static files from your Hono app               |
| `hono init`                  | Add a Hono app to the current directory                |

`file` is the path to your app file. When omitted, the app is found in `src/index.ts`, `src/index.tsx`, `src/index.js`, or `src/index.jsx`. TypeScript and JSX are supported.

### routes

Show all routes of your Hono app, like [`showRoutes()`](/docs/helpers/dev#showroutes). Routes are resolved from the real app instance, so mounted sub-apps and `basePath` are expanded.

```sh
hono routes
hono routes --verbose src/app.ts
```

- `--verbose` - include middleware
- `--plain` - human-readable output instead of JSON
- `-e, --external <package>` - mark a package as external (can be used multiple times)

```json
{
  "ok": true,
  "data": {
    "router": "SmartRouter + RegExpRouter",
    "routes": [
      {
        "method": "GET",
        "path": "/",
        "name": "[handler]",
        "isMiddleware": false
      },
      {
        "method": "POST",
        "path": "/posts",
        "name": "[handler]",
        "isMiddleware": false
      }
    ]
  }
}
```

### request

Send a request to your app through `app.request()`. No server is needed. `path` defaults to `/`.

```sh
hono request /
hono request /users/123
hono request /api/users -X POST -d '{"name":"Alice"}'
hono request /todos -X POST -d 'title=milk'
hono request /api/protected -H 'Authorization: Bearer token'
cat payload.json | hono request /api/users -X POST -d @-
hono request /api/users/123 --trace
hono request / --runtime bun
```

- `-X, --method <method>` - HTTP method (default: `GET`)
- `-d, --data <data>` - request body (`@file` reads a file, `@-` reads stdin). A JSON object or array is sent as JSON, anything else as a form, unless `-H` sets `Content-Type`
- `-H, --header <header>` - custom header (can be used multiple times)
- `--trace` - include the matched routes in the output
- `--runtime <runtime>` - run the app on `node` (default), `bun`, `deno`, `workerd`, or `vite`
- `--compact` - one-line JSON without the headers
- `--no-bindings` - skip loading the local Cloudflare bindings
- `-w, --watch` - watch for changes and resend the request
- `-o, --output <file>` - write the response body to a file
- `--plain` - print the raw body like curl (`-i` adds the status and headers, `-I` shows only them)

A JSON response body is embedded as an object:

```json
{
  "ok": true,
  "data": {
    "status": 200,
    "headers": { "content-type": "application/json" },
    "body": { "message": "Hello World" }
  }
}
```

With `--trace`, the output has `matchedRoutes`: which middleware and handler matched, and which one responded. A 404 result suggests running it.

You can also pass the app code from stdin with `-` as the file. `app` is predefined and exported for you:

```sh
echo 'app.get("/hello", (c) => c.json({ ok: true }))' | hono request /hello -
```

#### Cloudflare bindings

In a project with a wrangler config, `c.env` carries the real local bindings (KV, D1, R2, vars) automatically, while the app runs on Node.js. This works in `request`, `batch`, `snapshot`, and `ssg`. Skip it with `--no-bindings`. It needs [wrangler](https://developers.cloudflare.com/workers/wrangler/) installed in the project.

`--runtime workerd` runs the whole app inside workerd instead, with the wrangler config. It is heavier, but it is the full runtime. The entry is `main` in the wrangler config, so pass no file argument.

#### Vite

`--runtime vite` sends the requests through the Vite dev server of the project, for an app that a Vite plugin builds. The app comes from the Vite config, so pass no file argument. It is the default in a project with `cloudflare.config.ts` and a Vite config, where `c.env` has the bindings, and in a Vite project with no `src/index.ts`. This works in `request`, `batch`, and `snapshot`. A file argument, `--no-bindings`, `--trace`, or `--watch` runs the app on Node.js instead.

### batch

Run multiple requests from JSONL in one call, in order, against one app instance. In-memory state carries between steps.

```sh
hono batch - <<'JSONL'
{"path":"/users","expect":{"status":200}}
{"method":"POST","path":"/users","body":{"name":"Momo"},"expect":{"status":201,"body":{"name":"Momo"}},"save":{"id":".id"}}
{"path":"/users/{{id}}","expect":{"status":200}}
{"method":"DELETE","path":"/users/{{id}}","expect":{"status":204}}
JSONL
```

One JSON object per line: `method`, `path`, `body`, `headers`, `expect`, and `save`.

- `expect` declares the acceptance criteria. `status` matches exactly. `body` is a deep partial match: declared fields must match, and extra fields in the response are ignored.
- `save` stores a value from the response body by dot path, and later steps use it as `{{id}}`.
- A string `body` is sent as a form, or as JSON when it is a JSON object or array, unless `headers` sets the content type. An object `body` is sent as JSON.
- Cookies carry over like in a browser. A login step that sets a cookie signs in the steps after it. A `cookie` header in a step wins.
- A step without `expect` passes on any 2xx or 3xx and fails on a 4xx or 5xx. To accept a 4xx on purpose, declare it with `expect.status`.
- A failed step carries `diff`, one line per mismatch.

The output has the actual `status` and `body` of each step, `pass` per step, and a `summary`. Rerun until `failed` is 0.

- `-H, --header <header>` - a shared header for every step
- `--compact` - print only the failed steps and the summary
- `--runtime <runtime>` - `node` (default), `workerd`, or `vite`
- `--no-bindings` - skip loading the local Cloudflare bindings

### snapshot

Print the current behavior of the app as batch JSONL lines, to stdout. No file is written.

```sh
hono snapshot
hono snapshot --status-only src/app.ts
```

Paramless GET routes are executed, and their actual status and body become the `expect`. A GET route with a param is executed too when the app already showed a path for it, in a link or in a JSON field with the param's name. Other param routes and non-GET routes are printed without an `expect`, for you to fill in. One probe line records the response for a path that matches no route.

Unlike `routes`, this command sends real requests, so middleware runs.

Capture before a refactor, then rerun the lines with `hono batch` until `failed` is 0.

- `--status-only` - capture only the status codes, not the bodies
- `--runtime <runtime>` - `node` (default), `workerd`, or `vite`
- `--no-bindings` - skip loading the local Cloudflare bindings

### diff

Show what your uncommitted changes do to the app. It runs the app at the last commit and as it is now, and compares the answers. Nothing to capture first.

```sh
hono diff
hono diff --base main
```

- `--base <ref>` - the commit to compare with (default: `HEAD`)

The GET routes that `hono snapshot` runs and a 404 probe are run on both sides. `changed` lists each one that answers differently, with the status and body differences. Routes that appear or disappear are in `added` and `removed`. Other param routes and non-GET routes are not run, so check them with `hono batch`.

Each side runs in a temporary git worktree with fresh local data, so data you wrote while testing does not count. `node_modules` is shared, and `.dev.vars` is copied. An empty `changed` after a refactor means the GET routes answer as before.

```json
{
  "ok": true,
  "data": {
    "base": "HEAD",
    "compared": 6,
    "changed": [
      { "route": "GET /api/posts", "status": "200 -> 401" }
    ],
    "added": ["POST /login"],
    "removed": []
  }
}
```

### benchmark

Measure the performance of your Hono app. It is a micro benchmark of routing and handlers: `app.request()` is called directly, with no HTTP stack and no network. Each run happens in a fresh process, so results are comparable.

```sh
hono benchmark
hono benchmark -P /users
hono benchmark -P /users -X POST -d '{"name":"Alice"}' -H 'Content-Type: application/json'
hono benchmark --hono 4.12.3 --hono 4.13.0
hono benchmark --hono ../hono
```

- `-P, --path <path>` - benchmark only this path (can be used multiple times)
- `-X`, `-d`, `-H` - the method, body, and headers for `-P` paths
- `--duration <ms>` - how long to measure each route (default: `500`)
- `--warmup <count>` - requests before measuring (default: `30`)
- `--hono <version-or-path>` - benchmark the same app with another Hono: an npm version, or a local checkout

A few percent of difference is noise. To compare, run it more than once and check that the difference repeats.

### ssg

Generate static files from your Hono app, like the [SSG helper](/docs/helpers/ssg).

```sh
hono ssg
hono ssg -o dist/static src/app.ts
hono ssg --exclude '/api/*'
```

- `-o, --outdir <dir>` - output directory (default: `static`)
- `--include <path>` / `--exclude <path>` - select routes by path. `*` matches anything
- `--no-bindings` - skip loading the local Cloudflare bindings

A page that does not answer 200 is not written. It is listed in `skipped` with its status, so check it with `hono request <path>`.

```json
{
  "ok": true,
  "data": {
    "output": "static",
    "files": ["static/index.html", "static/about.html"],
    "skipped": [{ "path": "/counter", "status": 500 }]
  }
}
```

### init

Add a Hono app from a [create-hono](/docs/guides/create-hono) template to the current directory. Use it in a project that already exists, where `npm create hono` cannot.

```sh
npm install -D @hono/cli
npx hono init --template cloudflare-workers --install
npx hono request /
```

- `-t, --template <template>` - the template, one of `aws-lambda`, `bun`, `cloudflare-workers`, `deno`, `fastly`, `lambda-edge`, `netlify`, `nextjs`, `nodejs`, `vercel`, or `x-basic`
- `-i, --install` - install the dependencies with the package manager from the lockfile, or from the command that started `hono`

Without `--template`, the template comes from the files in the directory: `wrangler.jsonc` or `cloudflare.config.ts` means `cloudflare-workers`, `deno.json` means `deno`, `bun.lock` means `bun`, and so on. With no hint, a terminal shows a list to pick from. Without a terminal, the error lists the templates.

A file that already exists is never overwritten. It is listed in `skipped`. `package.json` is merged, and its existing values win, except `type`, which the template sets to `module`. With a wrangler config in place, the template does not add `cloudflare.config.ts`, and the other way around. Without `--install`, run your package manager next.

```json
{
  "ok": true,
  "data": {
    "template": "cloudflare-workers",
    "detectedFrom": "wrangler.jsonc",
    "written": ["src/index.ts"],
    "skipped": ["wrangler.jsonc"]
  }
}
```
