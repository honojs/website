# Google Cloud Run

[Google Cloud Run](https://cloud.google.com/run) は Google Cloud 上に構築されたサーバーレスプラットフォームです。 イベントに対してコードを実行でき、基盤となるコンピューティングリソースは Google が自動で管理します。

Google Cloud Run はサービスを実行するためにコンテナを使用します。 つまり、 Dockerfile を設定することで好きなランタイム (Deno や Bun 等) を使用できることを意味します。 Dockerfile が無かった場合、 Google Cloud Run はデフォルトの Node.js ビルドパックを使用します。

このガイドは、あなたがすでに Google Cloud アカウントと請求先アカウントを持っていることを前提にしています。

## 1. CLI をインストールする

Google Cloud Platform での作業は、 [gcloud CLI](https://cloud.google.com/sdk/docs/install) を使用するのが最も簡単です。

例えば、 MacOS で Homebrew を使用するとき:

```sh
brew install --cask gcloud-cli
```

CLI で認証します。

```sh
gcloud auth login
```

## 2. プロジェクトをセットアップする

プロジェクトを作成します。 提案されるプロジェクトIDをそのまま使用してください。

```sh
gcloud projects create --set-as-default --name="my app"
```

プロジェクト ID とプロジェクト番号を簡単に使用するために環境変数を作成してください。 `gcloud projects list` コマンドでプロジェクトが正しく表示されるまでは最大30秒かかります。

```sh
PROJECT_ID=$(gcloud projects list \
    --format='value(projectId)' \
    --filter='name="my app"')

PROJECT_NUMBER=$(gcloud projects list \
    --format='value(projectNumber)' \
    --filter='name="my app"')

echo $PROJECT_ID $PROJECT_NUMBER
```

請求先アカウント ID を探します。

```sh
gcloud billing accounts list
```

前のコマンドの出力から、請求先アカウントをプロジェクトに追加します。

```sh
gcloud billing projects link $PROJECT_ID \
    --billing-account=[billing_account_id]
```

必要な API を有効化します。

```sh
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com
```

Cloud Build にアクセスできるように、サービスアカウントの権限を更新します。

```sh
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --role=roles/run.builder
```

## 3. Hello World

"create-hono" コマンドでプロジェクトを始めましょう! `nodejs` を選択してください。

```sh
npm create hono@latest my-app
```

`my-app` ディレクトリに移動し、依存関係をインストールします。

```sh
cd my-app
npm i
```

`src/index.ts` で ポートを `8080` に設定します。

<!-- prettier-ignore -->
```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000 // [!code --]
  port: 8080 // [!code ++]
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
```

ローカルで開発サーバーを実行し、 Web ブラウザで http://localhost:8080 にアクセスしてください。

```sh
npm run dev
```

## 4. デプロイ

コマンドでデプロイを開始し、対話形式のプロンプトに従って設定をします。 (例: リージョンの設定)

```sh
gcloud run deploy my-app --source . --allow-unauthenticated
```

## ランタイムを変更する

Deno や Bun (または、カスタム Node.js コンテナ) を使用してデプロイを行いたい場合、 `Dockerfile` (と、必要に応じて `.dockerignore` ) を使用したい環境に合わせて設定してください。

コンテナ化の詳細は以下のドキュメントを参照してください:

- [Nodejs](/docs/getting-started/nodejs#building-deployment)
- [Bun](https://bun.com/guides/ecosystem/docker)
- [Deno](https://docs.deno.com/examples/google_cloud_run_tutorial)
