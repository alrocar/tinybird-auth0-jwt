# Auth0 + Tinybird JWT

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