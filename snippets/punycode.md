### Punycode
Use Unicode for url

## Snippets

this example is for who want to use **Unicode** for url.  

Currently, `c.redirect` and anyone do not support **Unicode**.  
`c.redirect("https://🔥.com")` throw Error.  
`https://🔥.com` is expressed like `https://xn--4v8h.com` in **Punycode**.  

You should conversion **Punycode** from Unicode.  
There are many such libraries, but you do not need to use them.  
The **Web standard api** is sufficient.  

```typescript
const url = new URL("https://🔥.com").href
console.log(url) // https://xn--4v8h.com
```

`c.redirect(new URL("https://🔥.com").href)`
