# JWT Authentication Helper

This helper provides functions for encoding, decoding, signing, and verifying JSON Web Tokens (JWTs). JWTs are commonly used for authentication and authorization purposes in web applications. This helper offers robust JWT functionality with support for various cryptographic algorithms.

## Import

To use this helper, you can import it as follows:

```ts
import { decode, sign, verify } from 'hono/jwt'
```

::: info
[JWT Middleware](/docs/middleware/builtin/jwt) also import the `jwt` function from the `hono/jwt`.
:::

## `sign()`

This function generates a JWT token by encoding a payload and signing it using the specified algorithm and key.

```ts
sign(
  payload: JWTPayload,
  privateKey: SignatureKey, // string | HonoJsonWebKey | CryptoKey
  alg?: SignatureAlgorithm // default: 'HS256'
): Promise<string>
```

### Example

```ts
import { sign } from 'hono/jwt'

const payload = {
  sub: 'user123',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
}
const secret = 'mySecretKey'
const token = await sign(payload, secret)
```

### Options

<br/>

#### <Badge type="danger" text="required" /> payload: `JWTPayload`

The JWT payload to be signed. You can include other claims like in [Payload Validation](#payload-validation).

#### <Badge type="danger" text="required" /> privateKey: `SignatureKey`

The key used to sign the token. `SignatureKey` is `string | HonoJsonWebKey | CryptoKey`. A string is typical for HMAC algorithms (`HS256`, `HS384`, `HS512`). Asymmetric algorithms (`RS*`, `PS*`, `ES*`, `EdDSA`) take a `CryptoKey` or JWK.

#### <Badge type="info" text="optional" /> alg: [AlgorithmTypes](#supported-algorithmtypes)

The algorithm used for JWT signing. The default is `HS256`. If `privateKey` is a JWK that includes `alg`, that value is used.

## `verify()`

This function checks if a JWT token is genuine and still valid. It ensures the token hasn't been altered and checks validity only if you added [Payload Validation](#payload-validation).

`verify()` takes three arguments. Claim checks such as `iss`, `aud`, and `typ` belong on the optional options object passed as the third argument, not as extra positional parameters. The algorithm is required; omitting it throws `JwtAlgorithmRequired`.

```ts
verify(
  token: string,
  publicKey: SignatureKey, // string | HonoJsonWebKey | CryptoKey
  algOrOptions: SignatureAlgorithm | VerifyOptionsWithAlg
): Promise<JWTPayload>
```

### Example

```ts
import { verify } from 'hono/jwt'

const tokenToVerify = 'token'
const secretKey = 'mySecretKey'

const decodedPayload = await verify(tokenToVerify, secretKey, 'HS256')
console.log(decodedPayload)

// Pass claim checks on the third argument; they are not positional parameters
const decodedWithIssuer = await verify(tokenToVerify, secretKey, {
  alg: 'HS256',
  iss: 'my-issuer',
})
```

### Options

<br/>

#### <Badge type="danger" text="required" /> token: `string`

The JWT token to be verified.

#### <Badge type="danger" text="required" /> publicKey: `SignatureKey`

The key used to verify the token. `SignatureKey` is `string | HonoJsonWebKey | CryptoKey`. A string is typical for HMAC algorithms. Asymmetric algorithms take a `CryptoKey` or JWK.

#### <Badge type="danger" text="required" /> algOrOptions: [AlgorithmTypes](#supported-algorithmtypes) `| VerifyOptionsWithAlg`

Either an algorithm string, or an options object that must include `alg`. Additional `VerifyOptions` fields can be set on that object:

#### <Badge type="info" text="optional" /> VerifyOptions.iss: `string | RegExp`

The expected issuer used for JWT verification. The `iss` claim is not checked unless this is set.

#### <Badge type="info" text="optional" /> VerifyOptions.aud: `string | string[] | RegExp`

The expected audience used for JWT verification. If this is set, the token must include an `aud` claim and at least one audience value must match.

#### <Badge type="info" text="optional" /> VerifyOptions.typ: `string | string[]`

The expected `typ` header of the token, for example `at+jwt` for OAuth 2.0 access tokens. If this is set, the token must have one of these values. If this is not set, only `JWT` or no `typ` is accepted.

#### <Badge type="info" text="optional" /> VerifyOptions.nbf: `boolean`

The `nbf` (not before) claim is verified if present and this is `true`. The default is `true`.

#### <Badge type="info" text="optional" /> VerifyOptions.iat: `boolean`

The `iat` (issued at) claim is verified if present and this is `true`. The default is `true`.

#### <Badge type="info" text="optional" /> VerifyOptions.exp: `boolean`

The `exp` (expiration time) claim is verified if present and this is `true`. The default is `true`.

## `decode()`

This function decodes a JWT token without performing signature verification. It extracts and returns the header and payload from the token.

```ts
decode(token: string): { header: TokenHeader; payload: JWTPayload }
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

<br/>

#### <Badge type="danger" text="required" /> token: `string`

The JWT token to be decoded.

> The `decode` function allows you to inspect the header and payload of a JWT token _**without**_ performing verification. This can be useful for debugging or extracting information from JWT tokens.

## Payload Validation

When verifying a JWT token, claims are checked only when they are present on the payload (and, for `iss` / `aud`, only when you pass the matching option):

- `exp`, `nbf`, and `iat` are verified by default when the claim is present. Set `exp`, `nbf`, or `iat` to `false` on the third-argument options object to skip that check.
- `iss` is checked only when you pass `iss` in that options object.
- `aud` is checked only when you pass `aud`; the token must then include a matching `aud` claim.

You do not need to include every claim in the payload. Add a claim only if you want that check to apply.

## Custom Error Types

The module also defines custom error types to handle JWT-related errors.

- `JwtAlgorithmNotImplemented`: Indicates that the requested JWT algorithm is not implemented.
- `JwtAlgorithmRequired`: Indicates that `verify()` was called without an algorithm.
- `JwtAlgorithmMismatch`: Indicates that the algorithm passed to `verify()` does not match the token header.
- `JwtTokenInvalid`: Indicates that the JWT token is invalid.
- `JwtTokenNotBefore`: Indicates that the token is being used before its valid date.
- `JwtTokenExpired`: Indicates that the token has expired.
- `JwtTokenIssuedAt`: Indicates that the "iat" claim in the token is incorrect.
- `JwtTokenIssuer`: Indicates that the "iss" claim in the token is incorrect.
- `JwtPayloadRequiresAud`: Indicates that an `aud` claim is required when `aud` verification is configured.
- `JwtTokenAudience`: Indicates that the token's `aud` claim does not match the expected audience.
- `JwtTokenSignatureMismatched`: Indicates a signature mismatch in the token.

## Supported AlgorithmTypes

The module supports the following JWT cryptographic algorithms:

- `HS256`: HMAC using SHA-256
- `HS384`: HMAC using SHA-384
- `HS512`: HMAC using SHA-512
- `RS256`: RSASSA-PKCS1-v1_5 using SHA-256
- `RS384`: RSASSA-PKCS1-v1_5 using SHA-384
- `RS512`: RSASSA-PKCS1-v1_5 using SHA-512
- `PS256`: RSASSA-PSS using SHA-256 and MGF1 with SHA-256
- `PS384`: RSASSA-PSS using SHA-384 and MGF1 with SHA-384
- `PS512`: RSASSA-PSS using SHA-512 and MGF1 with SHA-512
- `ES256`: ECDSA using P-256 and SHA-256
- `ES384`: ECDSA using P-384 and SHA-384
- `ES512`: ECDSA using P-521 and SHA-512
- `EdDSA`: EdDSA using Ed25519
