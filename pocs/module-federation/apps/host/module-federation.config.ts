export const mfConfig = {
  name: "host",
  exposes: {},
  remotes: {
    checkout: "checkout@http://localhost:3001/mf-manifest.json",
  },
  shared: ["react", "react-dom"],
};
