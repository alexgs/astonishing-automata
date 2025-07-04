# Getting a long-lived testing token

1. Open up `chenowyn` and log in.
2. Open the dev tools console and run `await window.Clerk.session.getToken({ template: 'testing-jwt' })`
3. Copy the token that is returned into the `http-client.env.json` file in this directory.

## References

- [Testing with Postman](https://clerk.com/docs/testing/postman-or-insomnia)
