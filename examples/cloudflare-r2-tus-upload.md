# Cloudflare R2 TUS Upload

The [TUS protocol](https://tus.io/) enables resumable file uploads, allowing clients to pause and resume large file transfers. This is particularly useful for handling large files over unreliable connections.

You can implement TUS protocol uploads to Cloudflare R2 using Hono with the [@capgo/hono-r2-tus-uploader](https://github.com/Cap-go/hono-r2-tus-uploader) package, which combines Durable Objects for upload state management and R2 for file storage.

## Installation

```bash
npm install @capgo/hono-r2-tus-uploader
```

Or with Bun:

```bash
bun add @capgo/hono-r2-tus-uploader
```

## Configuration

First, configure your R2 bucket and Durable Object bindings in `wrangler.toml`:

```toml
name = "tus-upload-server"
main = "src/index.ts"
compatibility_date = "2024-04-03"
node_compat = true

[[r2_buckets]]
binding = "ATTACHMENT_BUCKET"
bucket_name = "attachments"
preview_bucket_name = "attachments"

[durable_objects]
bindings = [
  { name = "ATTACHMENT_UPLOAD_HANDLER", class_name = "AttachmentUploadHandler" }
]

[[migrations]]
tag = "v1"
new_classes = ["AttachmentUploadHandler"]

[observability]
enabled = true
```

## Basic Implementation

Here's a complete example showing how to set up a TUS upload server with Hono:

```ts
import { Hono } from 'hono'
import { DurableObject } from 'cloudflare:workers'

// Define your bindings
type Bindings = {
  ATTACHMENT_BUCKET: R2Bucket
  ATTACHMENT_UPLOAD_HANDLER: DurableObjectNamespace
}

// Durable Object for managing upload state
export class AttachmentUploadHandler extends DurableObject {
  constructor(ctx: DurableObjectState, env: Bindings) {
    super(ctx, env)
  }

  // TUS protocol methods would be implemented here
  async handleUpload(request: Request): Promise<Response> {
    // Handle TUS protocol operations (HEAD, PATCH, POST, DELETE)
    // Manage upload metadata and chunks
    // Store final file in R2
    return new Response('Upload handled')
  }
}

// Main Hono app
const app = new Hono<{ Bindings: Bindings }>()

// TUS upload endpoint
app.all('/files/*', async (c) => {
  const env = c.env

  // Get or create a Durable Object instance for this upload
  const id = env.ATTACHMENT_UPLOAD_HANDLER.idFromName('upload-session')
  const stub = env.ATTACHMENT_UPLOAD_HANDLER.get(id)

  // Forward the request to the Durable Object
  return stub.handleUpload(c.req.raw)
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

export default app
export { AttachmentUploadHandler }
```

## Authentication Middleware

The TUS uploader supports custom authentication. Here's an example using bearer token authentication:

```ts
import { bearerAuth } from 'hono/bearer-auth'

const app = new Hono<{ Bindings: Bindings }>()

// Add authentication middleware
app.use('/files/*', bearerAuth({
  token: async (c) => {
    // Validate token from your auth system
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    // Return true if valid, false otherwise
    return token === c.env.UPLOAD_TOKEN
  }
}))

app.all('/files/*', async (c) => {
  // ... handle upload
})
```

## Client-Side Usage

On the client side, you can use the [tus-js-client](https://github.com/tus/tus-js-client) to upload files:

```js
import * as tus from 'tus-js-client'

const file = document.querySelector('input[type="file"]').files[0]

const upload = new tus.Upload(file, {
  endpoint: 'https://your-worker.workers.dev/files/',
  retryDelays: [0, 3000, 5000, 10000, 20000],
  metadata: {
    filename: file.name,
    filetype: file.type
  },
  onError: (error) => {
    console.error('Upload failed:', error)
  },
  onProgress: (bytesUploaded, bytesTotal) => {
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
    console.log(`Uploaded ${percentage}%`)
  },
  onSuccess: () => {
    console.log('Upload completed!')
  }
})

upload.start()
```

## Advanced: Upload Expiration

You can implement automatic cleanup of incomplete uploads using Durable Object alarms:

```ts
export class AttachmentUploadHandler extends DurableObject {
  async alarm() {
    // Clean up expired uploads
    const uploads = await this.ctx.storage.list()
    const now = Date.now()

    for (const [key, value] of uploads) {
      if (value.expiresAt && value.expiresAt < now) {
        await this.ctx.storage.delete(key)
      }
    }
  }

  async createUpload(metadata: any) {
    // Set expiration time (e.g., 24 hours)
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000)

    await this.ctx.storage.put('upload-metadata', {
      ...metadata,
      expiresAt
    })

    // Schedule alarm to clean up
    await this.ctx.storage.setAlarm(expiresAt)
  }
}
```

## Why Use TUS with R2?

- **Resumable uploads**: Clients can resume interrupted uploads without starting over
- **Large file support**: Handle files of any size without timeout issues
- **Bandwidth efficiency**: Only retransmit failed chunks, not the entire file
- **Progress tracking**: Get accurate upload progress for better UX
- **Durable state**: Durable Objects ensure upload state persists across requests

## Resources

- [TUS Protocol Specification](https://tus.io/protocols/resumable-upload)
- [@capgo/hono-r2-tus-uploader on GitHub](https://github.com/Cap-go/hono-r2-tus-uploader)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- [Built by Capgo](https://capgo.app/) - Live update platform for CapacitorJS applications

## See Also

- [Cloudflare Durable Objects](/examples/cloudflare-durable-objects)
- [File Upload](/examples/file-upload)
