---
title: JWT Authentication Helper
---

# JWT Authentication Helper

This helper provides functions for encoding, decoding, signing, and verifying JSON Web Tokens (JWTs). JWTs are commonly used for authentication and authorization purposes in web applications. This helper offers robust JWT functionality with support for various cryptographic algorithms.

## Import

To use this helper, you can import it as follows:

```ts
import { decode, sign, verify } from 'hono/jwt'
```

::: info
[JWT Middleware](/middleware/builtin/jwt) also import the `jwt` function from the `hono/jwt`.
:::

## `sign()`

This function generates a JWT token by encoding a payload and signing it using the specified algorithm and secret.

```ts
sign(
  payload: unknown,
  secret: string,
  alg?: 'HS256';

): Promise<string>;
```

### Example

```ts
import { sign } from 'hono/jwt'

const payload = {
  sub: 'user123',
  role: 'admin',
}
const secret = 'mySecretKey'
const token = await sign(payload, secret)
```

### Options

- `payload`: unknown - required
  - The JWT payload to be signed.
- `secret`: string - required
  - The secret key used for JWT verification or signing.
- `alg`: [AlgorithmTypes](#supported-algorithmtypes)
  - The algorithm used for JWT signing or verification. Default is HS256.

## `verify()`

This function checks if a JWT token is genuine and still valid. It ensures the token hasn't been altered and checks validity only if you added [Payload Validation](#payload-validation).

```ts
verify(
  token: string,
  secret: string,
  alg?: 'HS256';
): Promise<any>;

```

### Example

```ts
import { verify } from 'hono/jwt'

const tokenToVerify = 'token'
const secretKey = 'mySecretKey'

const decodedPayload = await verify(tokenToVerify, secretKey)
console.log(decodedPayload)
```

### Options

- `token`: string - required
  - The JWT token to be verified.
- `secret`: string - required
  - The secret key used for JWT verification or signing.
- `alg`: [AlgorithmTypes](#supported-algorithmtypes)
  - The algorithm used for JWT signing or verification. Default is HS256.

## `decode()`

This function decodes a JWT token without performing signature verification. It extracts and returns the header and payload from the token.

```ts
decode(token: string): { header: any; payload: any };
```

### Example

```ts
import { decode } from 'hono/jwt'

// Decode the JWT token
const tokenToDecode =
  'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAidXNlcjEyMyIsICJyb2xlIjogImFkbWluIn0.JxUwx6Ua1B0D1B0FtCrj72ok5cm1Pkmr_hL82sd7ELA'

const { header, payload } = decode(tokenToDecode)

console.log('Decoded Header:', header)
console.log('Decoded Payload:', payload)
```

### Options

- `token`: string - required
  - The JWT token to be decoded.

> The `decode` function allows you to inspect the header and payload of a JWT token _**without**_ performing verification. This can be useful for debugging or extracting information from JWT tokens.

## Payload Validation

When verifying a JWT token, the following payload validations are performed:

- `exp`: The token is checked to ensure it has not expired.
- `nbf`: The token is checked to ensure it is not being used before a specified time.
- `iat`: The token is checked to ensure it is not issued in the future.

Please ensure that your JWT payload includes these fields, as an object, if you intend to perform these checks during verification.

## Custom Error Types

The module also defines custom error types to handle JWT-related errors.

- `JwtAlgorithmNotImplemented`: Indicates that the requested JWT algorithm is not implemented.
- `JwtTokenInvalid`: Indicates that the JWT token is invalid.
- `JwtTokenNotBefore`: Indicates that the token is being used before its valid date.
- `JwtTokenExpired`: Indicates that the token has expired.
- `JwtTokenIssuedAt`: Indicates that the "iat" claim in the token is incorrect.
- `JwtTokenSignatureMismatched`: Indicates a signature mismatch in the token.

## Supported AlgorithmTypes

The module supports the following JWT cryptographic algorithms:

- `HS256`: HMAC using SHA-256
- `HS384`: HMAC using SHA-384
- `HS512`: HMAC using SHA-512
