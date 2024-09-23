
const OpenAI = require("openai");
const { writeResponse } = require('./util');
const ChatResponseMessage = require('./messages');

const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";


async function chatProcessing(messages,token, res) {
    console.log("model call");
    token = process.env.GITHUB_TOKEN;
    // create the model client
    //const client = new ModelClient(endpoint, new AzureKeyCredential(token));
    const client =new OpenAI({ baseURL: endpoint, apiKey: token });
    let response = null;
    try {
        response = await client.chat.completions.create({
            messages: messages,
              model: modelName,
              temperature: 1.,
              max_tokens: 1000,
              top_p: 1.
            });

    } catch (error) {
        console.error("Error occurred while calling the model:", error);
        writeResponse(res, ChatResponseMessage.MODEL_ERROR);
    }
    // Check if headers are already sent
    if (!res.headersSent) {
        // Set the appropriate headers
        res.setHeader('Content-Type', 'application/json');
    } 

    //console.log("response", response.body);
    if (response && response.choices) {
        for (const choice of response.choices) {
            //console.log(choice.message?.content ?? ``);
            writeResponse(res,
                choice.message?.content ?? ``,
                response.id,
                response.object,
                response.model,
                response.system_fingerprint,
                choice.index,
                choice.logprobs
            );
        }
    }
}

module.exports = { chatProcessing }