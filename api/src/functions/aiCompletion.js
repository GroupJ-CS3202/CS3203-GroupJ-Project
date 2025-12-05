const {app} =require("@azure/functions")
const {AzureOpenAI} = require ("openai")

const client = new AzureOpenAI({
    endpoint: process.env.Azure_OPENAI_ENDPOINT, 
    apiKey: process.env.AZURE_OPENAI_KEY,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT, 
    apiVersion: "2024-10-21"
});

app.http("aiCompletion", {
    methods: ["POST"], 
    authLevel: "anonymous", 
    route: "ai-completion", 
    handler: async (request, context) => {
        const {prompt} = await request.json();

        const result = await client.chat.completions.create({
            model : process.env.AZURE_OPENAI_DEPLOYMENT, 
            messages : [
                {role: "system", content: "You are helpful assistant"}, // rework this for the other endpoints for the homepage and such
                {role: "user", content: prompt}
            ], 
            max_tokens: 512
        });

        const reply = result.choices?.[0]?.message?.content?? "";
        return {status: 200, jsonBody: {reply}};

    }
});