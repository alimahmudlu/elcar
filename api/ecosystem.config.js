module.exports = {
  apps: [
    {
      name: "elcar-api",
      script: "src/index.js",
      env: {
        PORT: 3115,
        NODE_ENV: "production"
      }
    }
  ]
}
