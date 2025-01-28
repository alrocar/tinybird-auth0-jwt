# Auth0 + Tinybird JWT

Check https://alrocar.github.io/auth0-tinybird-jwt/ for a demo.

The workflow is:

1. Login to Auth0
2. Get a JWT token from a Tinybird workspace with read permissions on a pipe as part of the post-login Auth0 workflow
3. Use the JWT token to fetch data from Tinybird

## Create the action

- Go to Auth0 > Actions > Triggers > post-login
- Add a new custom action:

```js
const jwt = require("jsonwebtoken");

exports.onExecutePostLogin = async (event, api) => {
  const payload = {
    "workspace_id": '<YOUR_WORKSPACE_ID>',
    "name": "tinybird_jwt",
    "scopes": [{
        "type": "PIPES:READ",
        "resource": "<YOUR_PIPE_NAME>"
      }]
  }

  const options = {
    expiresIn: "7d"
  };

  const secret = event.secrets.tinybird_admin_token
  const token = jwt.sign(payload, secret, options);
  api.user.setAppMetadata("tinybird_jwt", token);

  if (event.authorization) {
    api.idToken.setCustomClaim("tinybird_jwt", token);
  }
}
```
- REPLACE `<YOUR_WORKSPACE_ID>` with your workspace ID
- REPLACE `<YOUR_PIPE_NAME>` with the name of the pipe you want the JWT token to have access to
- Add the `tinybird_admin_token` secret from https://app.tinybird.co/tokens
- Save the action
- Modify the trigger to use the action

![Trigger](auth0-trigger.png)
