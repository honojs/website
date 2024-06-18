# Philosophy

In this section, we talk about the concept, or philosophy, of Hono.

## Motivation

At first, I just wanted to create a web application on Cloudflare Workers.
But, there was no good framework that works on Cloudflare Workers.
So, I started building Hono.

I thought it would be a good opportunity to learn how to build a router using Trie trees.
Then a friend showed up with ultra crazy fast router called "RegExpRouter".
And I also have a friend who created the Basic authentication middleware.

Using only Web Standard APIs, we could make it work on Deno and Bun. When people asked "is there Express for Bun?", we could answer, "no, but there is Hono".
(Although Express works on Bun now.)

We also have friends who make GraphQL servers, Firebase authentication, and Sentry middleware.
And, we also have a Node.js adapter.
An ecosystem has sprung up.

In other words, Hono is damn fast, makes a lot of things possible, and works anywhere.
We might imagine that Hono could become the **Standard for Web Standards**.
