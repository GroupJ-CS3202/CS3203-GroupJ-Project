const { app } = require("@azure/functions");

app.http("hello", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log("Hello function was called");

    return {
      status: 200,
      jsonBody: {
        message: "Hello World!"
      }
    };
  }
});
