# messengerpeople-node

Unofficial Node.js library for `messengerpeople.dev`

`messengerpeople-dev` is a REST-API to send messages via WhatsApp Business API, Facebook Messenger or Telegram. This lib should help you to implement the important functions easily.

This npm lib does not officially belong to messengerpeople. I am still happy when this is used. I try to implement all requirements as good as possible. If a feature is missing or you find a bug. Feel free to open an issue or contribute to the open source code.

# Install :star2::package:

```
npm i messengerpeople-node
```

# Usage :sparkles::rocket:

For starting with this lib you need to create a `messengerpeopleClient` client.

## Creating a Client

You can connect the client by passing the `client_id` and `client_secret` following by the `scopes`.
Here you can find more information about the [client credentials](https://api.messengerpeople.dev/docs/authentication).

The `scopes` are importent. Please check on your own if you have set the required scopes for the respective API function. Otherwise it will not be executed successfully.

```ts
const client = await messengerpeopleClient({
  client_id: "<valid client id>",
  client_secret: "<valid client secret>",
  scope: [
    SCOPES.USER_PROFILE,
    SCOPES.MEDIA_CREATE,
    SCOPES.MEDIA_DELETE,
    SCOPES.MEDIA_DELETE,
    SCOPES.MEDIA_READ,
    SCOPES.MESSAGES_DELETE,
    SCOPES.MESSAGES_READ,
    SCOPES.MESSAGES_SEND,
  ],
});
```

As alternative you can use your `access_token` directly if you own this wide one. Do not forget, you have to renew it yourself and request the scopes on your own. We do not recommend this variant.

```ts
const client = await messengerpeopleClient({
  access_token: "<valid access token>",
});
```

## Using the client

All our functions are divided into individual modules.
| ModuleName | link |
| :--- | ---: |
| createHealthModule | [Health](https://api.messengerpeople.dev/docs/resource/health) |
| createMessagesModule | [Messages](https://api.messengerpeople.dev/docs/resource/messages) |

more comming soon (...)

Here is an example to send a whatsapp message to a recipient by using the `MessagesModule`

```ts
  const messageModule = createMessagesModule(client);
  await messageModule
    .send("< channel uuid>", "< phone number >", {
      type: "text",
      text: "Hello World :)",
    })
    .then((e) => {
      console.log(e.status);
    });
);
```

# Credits

This lib does not officially belong to messengerpeople GmbH.
Feel free to use, edit, distribute or whatever you want to do with this lib.
