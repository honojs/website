# Context Storage Middleware

The Context Storage Middleware stores the Hono `Context` in the `AsyncLocalStorage`, to make it globally accessible. 

## Import

```ts
import { Hono } from 'hono'
import { contextStorage, getContext } from 'hono/context-storage'
```

## Usage

```ts
type Env = {
  Variables: {
    message: string
  }
}

const app = new Hono<Env>()

app.use(contextStorage())

app.get('/', (c) => c.text(getMessage())

const getMessage = () => {
  return getContext<Env>().var.message
}
```
