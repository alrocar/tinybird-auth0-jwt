# Auth0 + Tinybird JWT
Set up an Auth0 action to get a Tinybird JWT token as part of the post-login Auth0 trigger.

## Demo

Check https://alrocar.github.io/tinybird-auth0-jwt/ for a demo.

## Prerequisites

1. An Auth0 account and tenant. [Sign up for free](https://auth0.com/signup).
2. A Tinybird account and workspace. [Sign up for free](https://tinybird.co/signup).

## Add the Auth0 Action

- Go to `Auth0` > `Actions` > `Triggers` > `post-login`
- Add a new custom action:

```js
const jwt = require("jsonwebtoken");

exports.onExecutePostLogin = async (event, api) => {
  if (!event.secrets.TINYBIRD_ADMIN_TOKEN) {
    console.log("Tinybird Admin Token is missing. Create a secret with name TINYBIRD_ADMIN_TOKEN.");
    return;
  }

  if (!event.configuration.TINYBIRD_WORKSPACE_ID) {
    console.log(
      "Tinybird Workspace ID is missing. Create a configuration variable with name TINYBIRD_WORKSPACE_ID."
    );
    return;
  }

  if (!event.configuration.TINYBIRD_PIPE_NAMES) {
    console.log(
      "Tinybird Pipe Names is missing. Create a configuration variable with name TINYBIRD_PIPE_NAMES."
    );
    return;
  }

  const scopes = event.configuration.TINYBIRD_PIPE_NAMES.split(",").map((pipeName) => ({
    type: "PIPES:READ",
    resource: pipeName,
  }));

  const payload = {
    workspace_id: event.configuration.TINYBIRD_WORKSPACE_ID,
    name: `tinybird_jwt_${event.user.id}`,
    scopes,
  };

  const options = {
    expiresIn: "7d",
  };

  const secret = event.secrets.TINYBIRD_ADMIN_TOKEN;
  const token = jwt.sign(payload, secret, options);
  api.user.setAppMetadata("tinybirdJWT", token);

  if (event.authorization) {
    api.idToken.setCustomClaim("https://app.tinybird.co", token);
  }

  console.log(`Tinybird JWT token set for user`);
};
```

- Configure the action with the required secrets and configuration variables
- Save the action
- Modify the `post-login`trigger to use the action

![Trigger](auth0-trigger.png)

## How to use the JWT token

The JWT token will be set in the id token with name `https://app.tinybird.co` as part of the post-login Auth0 workflow. 

```javascript
const user = await auth0Client.getUser();
const tinybirdJWT = user["https://app.tinybird.co"];

// Use the token to fetch data from Tinybird
const response = await fetch("https://api.tinybird.co/v0/pipes/your_pipe.json", {
  headers: {
    Authorization: `Bearer ${tinybirdJWT}`
  }
});

const data = await response.json();
console.log(data);
```
