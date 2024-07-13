# Pylon

Building a GraphQL API with Pylon is simple and straightforward. Pylon is a backend framework that is built on top of Hono and provides code-first GraphQL API development.

The GraphQL schema is generated in real-time from your TypeScript definitions, allowing you to focus solely on writing your service logic. This approach significantly improves development speed, enhances type safety, and reduces errors.

Any breaking changes in your code are instantly reflected in your API, enabling you to immediately see how changes impact its functionality.

## Setup new Pylon service

### Setup Pylon

You have to install Pylon as described in [their documentation](https://pylon.cronit.io/docs/installation/).

### Creating a new project

To create a new Pylon project, run the following command:

```bash
pylon new my-pylon-project
```

This will create a new directory called `my-pylon-project` with a basic Pylon project structure.

### Project structure

Pylon projects are structured as follows:

```
my-pylon-project/
├── .pylon/
├── src/
│   ├── index.ts
├── package.json
├── tsconfig.json
```

- `.pylon/`: Contains the production build of your project.
- `src/`: Contains the source code of your project.
- `src/index.ts`: The entry point of your Pylon service.
- `package.json`: The npm package configuration file.
- `tsconfig.json`: The TypeScript configuration file.

### Basic example

Here's an example of a basic Pylon service:

```ts
import { defineService } from '@getcronit/pylon'

export default defineService({
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
})
```

## Secure the API

Pylon integrates with ZITADEL, a cloud-native identity and access management solution, to provide secure authentication and authorization for your APIs. You can easily secure your Pylon API by following the steps outlined in the [ZITADEL documentation](https://zitadel.com/docs/examples/secure-api/pylon).

## Create a more complex API

Pylon allows you to create more complex APIs by leveraging its real-time schema generation capabilities. For more information about supported TypeScript types and how to define your API, refer to the [Pylon documentation](https://pylon.cronit.io/docs/type-safety-and-type-integration/)

This example demonstrates how to define complex types and services in Pylon. By leveraging TypeScript classes and methods, you can create powerful APIs that interact with databases, external services, and other resources.

```ts
import { defineService } from '@getcronit/pylon'

class Post {
  id: string
  title: string

  constructor(id: string, title: string) {
    this.id = id
    this.title = title
  }
}

class User {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  static async getById(id: string): Promise<User> {
    // Fetch user data from the database
    return new User(id, 'John Doe')
  }

  async posts(): Promise<Post[]> {
    // Fetch posts for this user from the database
    return [new Post('1', 'Hello, world!')]
  }

  async $createPost(title: string, content: string): Promise<Post> {
    // Create a new post for this user in the database
    return new Post('2', title)
  }
}

export default defineService({
  Query: {
    user: User.getById,
  },
  Mutation: {
    createPost: async (userId: string, title: string, content: string) => {
      const user = await User.getById(userId)
      return user.$createPost(title, content)
    },
  },
})
```

## Call the API

The Pylon API can be called using any GraphQL client library. For development purposes, it is
recommended to use the Pylon Playground, which is a web-based GraphQL IDE that allows you to interact with your API in real-time.

1. Start the Pylon server by running `bun run develop` in your project directory.
2. Open the Pylon Playground in your browser by navigating to `http://localhost:3000/graphql`.
3. Write your GraphQL query or mutation in the left pane.

![Pylon Playground](/images/pylon-example.png)

## Get access to the Hono context

You can access the Hono context anywhere in your code by using the `getContext` function. This function returns the current context object, which contains information about the request, response, and other context-specific data.

```ts
import { defineService, getContext } from '@getcronit/pylon'

export default defineService({
  Query: {
    hello: () => {
      const context = getContext()
      return `Hello, ${context.req.header('user-agent')}`
    },
  },
})
```

For more information about the Hono context object and its properties, refer to the [Hono documentation](https://hono.dev/docs/api/context) and [Pylon documentation](https://pylon.cronit.io/docs/context-management).

## Where does Hono fit in?

Pylon is built on top of Hono, a lightweight web framework for building web applications and APIs. Hono provides the core functionality for handling HTTP requests and responses, while Pylon extends this functionality to support GraphQL API development.

Besides GraphQL, you can also build routes and middleware. By using the `configureApp` export
it is possible to get access to the underlying Hono app instance and add routes and middleware.

```ts
import { defineService, PylonAPI } from '@getcronit/pylon'

export default defineService({
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
})

export const configureApp: PylonAPI['configureApp'] = (app) => {
  app.get('/hello', (ctx, next) => {
    return new Response('Hello, world!')
  })
}
```

## Conclusion

Pylon is a powerful web framework that simplifies the development of GraphQL APIs. By leveraging TypeScript type definitions, Pylon provides real-time schema generation, enhancing type safety and reducing errors. With Pylon, you can quickly build secure and scalable APIs that meet your business requirements. Pylons integration with Hono allows you to use all the features of Hono while focusing on GraphQL API development.

For more information about Pylon, check out the [official documentation](https://pylon.cronit.io/).

## See also

- [Pylon](https://github.com/getcronit/pylon)
- [Pylon documentation](https://pylon.cronit.io/docs)
- [Hono documentation](https://hono.dev/docs)
- [ZITADEL documentation](https://zitadel.com/docs/examples/secure-api/pylon)
