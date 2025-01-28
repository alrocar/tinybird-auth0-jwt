This action will set a Tinybird JWT token in the id token with name `https://app.tinybird.co` as part of the post-login Auth0 trigger.

## Prerequisites

1. An Auth0 account and tenant. [Sign up for free](https://auth0.com/signup).
2. A Tinybird account and workspace. [Sign up for free](https://tinybird.co/signup).

## Add the Auth0 Action

**Note:** Once the Action is successfully deployed, all logins for your tenant will be processed by this integration. Before activating the integration in production, [install and verify this Action on a test tenant](https://auth0.com/docs/get-started/auth0-overview/create-tenants/set-up-multiple-environments).

1. Select **Add Integration** (at the top of this page).
2. Read the necessary access requirements, and select **Continue**.
3. Configure the integration using the following fields:
   - TINYBIRD_ADMIN_TOKEN: The admin token for your Tinybird Workspace.
   - TINYBIRD_WORKSPACE_ID: The ID of your Tinybird Workspace.
   - TINYBIRD_PIPE_NAMES: Comma-separated list of the names of the pipes to give access to the JWT token.
4. Add the integration to your Library by selecting **Create**.
5. In the modal that appears, select the **Add to flow** link.
6. Drag the Action into the desired location in the flow.
7. Select **Apply Changes**.

## Results

The JWT token will be set in the id token with name `https://app.tinybird.co` as part of the post-login Auth0 workflow. 

```javascript
const user = await auth0Client.getUser();
const tinybirdJWT = user["https://app.tinybird.co"];
```

You can use this token to fetch data from Tinybird. See this [example](https://alrocar.github.io/auth0-tinybird-jwt/) for more information.

## Troubleshooting

Contact [Tinybird support](mailto:support@tinybird.co) if you have any questions or issues.
