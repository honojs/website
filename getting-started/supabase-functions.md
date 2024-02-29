# Supabase Edge Functions

[Supabase](https://supabase.com/) はオープンソースの Firebase 代替で、データベース、認証、ストレージ、今回使うサーバーレス関数などの Firebase の機能と同様なツールスイートを提供します。

Supabase Edge Functions はグローバルに分散されたサーバーサイド TypeScript 関数で、高いパフォーマンスのためにユーザーの近くで実行されます。 [Deno](https://deno.com/) を用いており、セキュリティの向上やモダン JavaScript/TypeScript などのメリットがあります。

Supabase Edge Functions を始める方法は以下の通りです:

## 1. セットアップ

### 前提条件

始める前に、 Supabase CLI がインストールされていることを確認してください。 まだインストールしていない場合は[公式ドキュメント](https://supabase.com/docs/guides/cli/getting-started)にしたがってインストールしてください。

### 新しいプロジェクトを作成する

1. ターミナル/コマンドプロンプトを開いてください。

2. Create a new Supabase project in a directory on your local machine by running:
2. 次のコマンドを実行して、ローカルマシンのディレクトリに新しい Supabase プロジェクトを作成します。

```bash
supabase init

```

このコマンドは現在のディレクトリに新しい Supabase プロジェクトを初期化します。

### エッジ関数の追加

3. Supabase プロジェクトの中で新しいエッジ関数を `hello-world` という名前で作成します:

```bash
supabase functions new hello-world

```

このコマンドで名前を指定して新しいエッジ関数をプロジェクトに作成します。

## 2. Hello World

`supabase/functions/hello-world/index.ts` にある `hello-world` 関数を編集してください:

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import type { Context } from 'https://deno.land/x/hono/mod.ts'

// change this to your function name
const functionName = 'hello-world'
const app = new Hono().basePath(`/${functionName}`)

app.get('/hello', (c: Context) => c.text('Hello from hono-server!'))

Deno.serve(app.fetch)
```

## 3. Run

ローカルで関数を動かすには次のコマンドを実行します:

1. 以下のコマンドを実行して関数を開始します:

```bash
supabase start # start the supabase stack
supabase functions serve --no-verify-jwt # start the Functions watcher
```

`--no-verify-jwt` フラグはローカル開発中に JWT 検証をバイパスできます。

2. cURL や Postman を使用して `http://127.0.0.1:54321/functions/v1/hello-world/hello` に GET リクエストを送信します:

```bash
curl  --location  'http://127.0.0.1:54321/functions/v1/hello-world/hello'
```

"Hello from hono-server!" という文字列が返されるはずです。

## 4. デプロイ

全てのエッジ関数をひとつのコマンドで Supabase にデプロイ出来ます:

```bash
supabase functions deploy
```

もしくは deploy コマンドで関数名を指定してそれぞれのエッジ関数をデプロイ出来ます:

```bash
supabase functions deploy hello-world

```

その他のデプロイ方法については Supabase ドキュメント [Deploying to Production](https://supabase.com/docs/guides/functions/deploy) をお読みください。
