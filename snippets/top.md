# Snippets

A collection of code samples.

### Hono Authentication Example
This code sample demonstrates a basic authentication system using Hono [JWT](https://hono.dev/helpers/jwt) and [Cookie](https://hono.dev/helpers/cookie).

```javascript
import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono()

app.post('/login', async (c) => {
  const { user, password } = await c.req.parseBody();
  if (user == "admin") {
    if (password == "admin") {
      const payload = {
        sub: user,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      }
      const secret = 'hono-is-cool'
      const token = await sign(payload, secret)
      setCookie(c, 'jwt-token', token)
      return c.text(`logged in`)
    }
    else {
      return c.text(`Wrong Password`)
    }
  }
  else {
    return c.text('Invalid!', 401)
  }
})

app.get('/dashboard', async (c) => {
  const cookie_with_jwt = getCookie(c, 'jwt-token')
  const tokenToVerify = cookie_with_jwt as string
  const secretKey = 'hono-is-cool'
  try {
    await verify(tokenToVerify, secretKey)
    const { header, payload } = decode(tokenToVerify)
    console.log('JWT Header:', header)
    console.log('JWT Payload:', payload)
    //It is a good practice to track all previous tokens, you can use a fast db like Redis for this
    return c.text(`You are valid user, use dashboard!\n Header algorithm: ${header.alg} \n Sub: ${payload.sub}`)
  } catch (error) {
    console.error('JWT verification failed:', error)
    return c.json({ "message": "You have to login!" }, 404)
  }
})

app.get('/logout', (c) => {
  deleteCookie(c, 'jwt-token')
  return c.text('Logout Done!')
})

export default app
```
**Endpoints:**

- POST /login: Endpoint for user login. Requires user and password parameters in the request body. If successful, returns a JWT token.
- GET /dashboard: Protected endpoint for accessing the dashboard. Requires a valid JWT token in the request cookie. Returns user information from the JWT token payload.
- GET /logout: Endpoint for user logout. Deletes the JWT token from the request cookie.

Store sensitive information securely ([env()](https://hono.dev/helpers/adapter#env)), such as the JWT secret, and avoid hardcoding it directly in the code.

Code sample added by: [Sakib Mahmud](https://github.com/Sigmakib2)
