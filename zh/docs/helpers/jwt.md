---
title: JWT
description: 此工具类提供了用于编码、解码、签名和验证 JSON Web Token (JWT) 的功能。JWT 常用于 Web 应用程序中的身份验证和授权。该工具类提供了强大的 JWT 功能，支持多种加密算法。
---

# JWT

此工具类提供了用于编码、解码、签名和验证 JSON Web Token (JWT) 的功能。JWT 常用于 Web 应用程序中的身份验证和授权。该工具类提供了强大的 JWT 功能，支持多种加密算法。

## 导入

您可以按以下方式导入此工具类：

```ts
import { decode, sign, verify } from 'hono/jwt'
```

::: info
[JWT 中间件](/docs/middleware/builtin/jwt)也从 `hono/jwt` 导入 `jwt` 函数。
:::

## `sign()`

此函数通过编码载荷并使用指定的算法和密钥进行签名来生成 JWT 令牌。

```ts
sign(
  payload: unknown,
  secret: string,
  alg?: 'HS256';
): Promise<string>;
```

### 示例

```ts
import { sign } from 'hono/jwt'

const payload = {
  sub: 'user123',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // 令牌在 5 分钟后过期
}
const secret = 'mySecretKey'
const token = await sign(payload, secret)
```

### 选项

<br/>

#### <Badge type="danger" text="必需" /> payload: `unknown`

要签名的 JWT 载荷。您可以包含[载荷验证](#载荷验证)中的其他声明。

#### <Badge type="danger" text="必需" /> secret: `string`

用于 JWT 验证或签名的密钥。

#### <Badge type="info" text="可选" /> alg: [算法类型](#支持的算法类型)

用于 JWT 签名或验证的算法。默认为 HS256。

## `verify()`

此函数检查 JWT 令牌是否真实且仍然有效。它确保令牌未被篡改，并且仅在您添加了[载荷验证](#载荷验证)时才检查有效性。

```ts
verify(
  token: string,
  secret: string,
  alg?: 'HS256';
): Promise<any>;
```

### 示例

```ts
import { verify } from 'hono/jwt'

const tokenToVerify = 'token'
const secretKey = 'mySecretKey'

const decodedPayload = await verify(tokenToVerify, secretKey)
console.log(decodedPayload)
```

### 选项

<br/>

#### <Badge type="danger" text="必需" /> token: `string`

要验证的 JWT 令牌。

#### <Badge type="danger" text="必需" /> secret: `string`

用于 JWT 验证或签名的密钥。

#### <Badge type="info" text="可选" /> alg: [算法类型](#支持的算法类型)

用于 JWT 签名或验证的算法。默认为 HS256。

## `decode()`

此函数在不进行签名验证的情况下解码 JWT 令牌。它从令牌中提取并返回头部和载荷。

```ts
decode(token: string): { header: any; payload: any };
```

### 示例

```ts
import { decode } from 'hono/jwt'

// 解码 JWT 令牌
const tokenToDecode =
  'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAidXNlcjEyMyIsICJyb2xlIjogImFkbWluIn0.JxUwx6Ua1B0D1B0FtCrj72ok5cm1Pkmr_hL82sd7ELA'

const { header, payload } = decode(tokenToDecode)

console.log('解码后的头部:', header)
console.log('解码后的载荷:', payload)
```

### 选项

<br/>

#### <Badge type="danger" text="必需" /> token: `string`

要解码的 JWT 令牌。

> `decode` 函数允许您在**不进行验证**的情况下检查 JWT 令牌的头部和载荷。这对于调试或从 JWT 令牌中提取信息很有用。

## 载荷验证

在验证 JWT 令牌时，会执行以下载荷验证：

- `exp`：检查令牌是否已过期。
- `nbf`：检查令牌是否在指定时间之前使用。
- `iat`：检查令牌是否在未来签发。

如果您打算在验证期间执行这些检查，请确保您的 JWT 载荷包含这些字段（作为对象）。

## 自定义错误类型

该模块还定义了用于处理 JWT 相关错误的自定义错误类型：

- `JwtAlgorithmNotImplemented`：表示请求的 JWT 算法未实现。
- `JwtTokenInvalid`：表示 JWT 令牌无效。
- `JwtTokenNotBefore`：表示令牌在其有效日期之前使用。
- `JwtTokenExpired`：表示令牌已过期。
- `JwtTokenIssuedAt`：表示令牌中的 "iat" 声明不正确。
- `JwtTokenSignatureMismatched`：表示令牌的签名不匹配。

## 支持的算法类型

该模块支持以下 JWT 加密算法：

- `HS256`：使用 SHA-256 的 HMAC
- `HS384`：使用 SHA-384 的 HMAC
- `HS512`：使用 SHA-512 的 HMAC
- `RS256`：使用 SHA-256 的 RSASSA-PKCS1-v1_5
- `RS384`：使用 SHA-384 的 RSASSA-PKCS1-v1_5
- `RS512`：使用 SHA-512 的 RSASSA-PKCS1-v1_5
- `PS256`：使用 SHA-256 和 MGF1 with SHA-256 的 RSASSA-PSS
- `PS384`：使用 SHA-386 和 MGF1 with SHA-386 的 RSASSA-PSS
- `PS512`：使用 SHA-512 和 MGF1 with SHA-512 的 RSASSA-PSS
- `ES256`：使用 P-256 和 SHA-256 的 ECDSA
- `ES384`：使用 P-384 和 SHA-384 的 ECDSA
- `ES512`：使用 P-521 和 SHA-512 的 ECDSA
- `EdDSA`：使用 Ed25519 的 EdDSA
