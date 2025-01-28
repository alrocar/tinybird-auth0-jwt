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
