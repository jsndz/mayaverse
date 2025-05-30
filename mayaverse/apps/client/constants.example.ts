export const configuration = {
  iceServers: [
    { urls: "stun:stun.relay.metered.ca:80" },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "YourUsernameHere",
      credential: "YourCredentialHere",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "YourUsernameHere",
      credential: "YourCredentialHere",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "YourUsernameHere",
      credential: "YourCredentialHere",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "YourUsernameHere",
      credential: "YourCredentialHere",
    },
  ],
};
