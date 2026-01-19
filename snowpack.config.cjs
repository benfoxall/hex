module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  exclude: [
    "**/*.test.js",
    "**/*.test.jsx",
    "**/test-setup.js",
    "**/__tests__/**/*",
  ],
  // experiments: {
  //   optimize: {
  //     bundle: true,
  //     minify: true,
  //     target: "es2018",
  //   },
  // },
};
