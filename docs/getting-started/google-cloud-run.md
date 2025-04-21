# Google Cloud Run

[Google Cloud Run](https://cloud.google.com/run) is a serverless platform built by Google Cloud. You can run your code in response to events and Google automatically manages the underlying compute resources for you.

You can deploy using your preferred runtime by providing a Dockerfile. Hono has starters for Google Cloud Run using nodejs, Deno, and Bun runtimes.

This guide assumes you already have a Google Cloud account and a billing account.

## 1. Install the CLI

When working with Google Cloud Platform it is easiest to work with the [gcloud CLI](https://cloud.google.com/sdk/docs/install).

For example, on MacOS using Homebrew:

```sh
brew install --cask google-cloud-sdk
```

Authenticate with the CLI.

```sh
gcloud auth login
```

## 2. Project setup

Create a project. Accept the auto-generated project ID at the prompt.

```sh
gcloud projects create --set-as-default --name="my app"
```

Create environment variables for your project ID and project number for easy reuse.

```sh
PROJECT_ID=$(gcloud projects list \
    --format='value(projectId)' \
    --filter='name="my app"')

PROJECT_NUMBER=$(gcloud projects list \
    --format='value(projectNumber)' \
    --filter='name="my app"')

echo $PROJECT_ID $PROJECT_NUMBER
```

Find your billing account ID.

```sh
gcloud billing accounts list
```

Add your billing account from the prior command to the project.

```sh
gcloud billing projects link $PROJECT_ID \
    --billing-account=[billing_account_id]
```

Enable the required APIs.

```sh
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com
```

Update the service account permissions to have access to Cloud Build.

```sh
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --role=roles/run.builder
```

## 3. Hello World

Start your project with "create-hono" command. Select `google-cloud-run-nodejs` template for this example.

```sh
npm create hono@latest my-app
```

Move to `my-app` and install the dependencies.

```sh
cd my-app
npm i
```

Run the development server locally. Then, access http://localhost:8080 in your Web browser.

```sh
npm run dev
```

## 4. Deploy

Start the deployment and follow the interactive prompts (E.g., select a region).

```sh
gcloud run deploy my-app --source . --allow-unauthenticated
```

:::warning
The `google-cloud-run-nodejs` starter Dockerfile is written for `npm`. Remember to update the Dockerfile if using an alternate package manager.
:::
