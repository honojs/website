# Hono Stacks

Hono は簡単なことを簡単にし、難しいことも簡単にします。
JSON を返すだけの場合に最適です。
また、 REST API サーバーとクライアントを含むフルスタックアプリケーションを作るのにも最適です。

## RPC

Hono の RPC 機能を使用すると、コードをほとんど変更せずに API 仕様を共用できます。
`hc` により作成されたクライアントは仕様を読み取り型安全にエンドポイントへアクセスします。

以下のライブラリで実現できます。

- Hono - API サーバー
- [Zod](https://zod.dev) - バリデーター
- [Zod Validator Middleware](https://github.com/honojs/middleware/tree/main/packages/zod-validator)
- `hc` - HTTP クライアント

これらのコンポーネントのセットを **Hono Stack** と呼ぶことが出来ます。
API サーバーとそのクライアントを作ってみましょう。

## API を書く

まずは、 GET リクエストを受け取り JSON を返すエンドポイントを作成します。

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/hello', (c) => {
  return c.json({
    message: `Hello!`,
  })
})
```

## Zod でバリデーションする

Zod でクエリパラメータのバリデーションを行ってからデータを受け取ります。

![SC](/images/sc01.gif)

```ts
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

app.get(
  '/hello',
  zValidator(
    'query',
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.valid('query')
    return c.json({
      message: `Hello! ${name}`,
    })
  }
)
```

## 型の共有

エンドポイント仕様を出力するには型をエクスポートします。

```ts{1,17}
const route = app.get(
  '/hello',
  zValidator(
    'query',
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.valid('query')
    return c.json({
      message: `Hello! ${name}`,
    })
  }
)

export type AppType = typeof route
```

## クライアント

次はクライアントの実装です。
AppType ジェネリクスを `hc` に渡してクライアントオブジェクトを作ります。
驚くほど補完が効き、エンドポイントのパスとリクエストの型がサジェストされます。

![SC](/images/sc03.gif)

```ts
import { AppType } from './server'
import { hc } from 'hono/client'

const client = hc<AppType>('/api')
const res = await client.hello.$get({
  query: {
    name: 'Hono',
  },
})
```

`Response` は fetch API と互換性がありますが、 `json()` で取得できるデータには型があります。

![SC](/images/sc04.gif)

```ts
const data = await res.json()
console.log(`${data.message}`)
```

API 仕様を共用できるということは、サーバーサイドの変更を認識することが出来ます。

![SS](/images/ss03.png)

## React といっしょ

Cloudflare Pages で React を用いたアプリケーションを作成できます。

API サーバー:

```ts
// functions/api/[[route]].ts
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const schema = z.object({
  id: z.string(),
  title: z.string(),
})

type Todo = z.infer<typeof schema>

const todos: Todo[] = []

const route = app
  .post('/todo', zValidator('form', schema), (c) => {
    const todo = c.req.valid('form')
    todos.push(todo)
    return c.json({
      message: 'created!',
    })
  })
  .get((c) => {
    return c.json({
      todos,
    })
  })

export type AppType = typeof route

export const onRequest = handle(app, '/api')
```

React と React Query を使ったクライアント:

```tsx
// src/App.tsx
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppType } from '../functions/api/[[route]]'
import { hc, InferResponseType, InferRequestType } from 'hono/client'

const queryClient = new QueryClient()
const client = hc<AppType>('/api')

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

const Todos = () => {
  const query = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.todo.$get()
      return await res.json()
    },
  })

  const $post = client.todo.$post

  const mutation = useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>['form']
  >(
    async (todo) => {
      const res = await $post({
        form: todo,
      })
      return await res.json()
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now().toString(),
            title: 'Write code',
          })
        }}
      >
        Add Todo
      </button>

      <ul>
        {query.data?.todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```
