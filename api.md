### API for the project

## HTTP server

- GET: api/v1/signup

```js
{
    "name":"xx",
    "password":"xyx"
    "type":"admin"/"user"
}
```

- POST: api/v1/signin

```js
{
    "name":"xx",
    "password":"xyx"
}
```

returns:

```js
{
    "token":"ssssssssssssssssssssss"
}
```

## Websocket Schema

Client events

- Join space
- Movement

Server Events

- Space joined
- Movement Rejected
- Movement
- Leave
