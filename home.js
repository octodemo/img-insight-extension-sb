
require("dotenv").config();
const { getImageFromRepo } = require('./gh-img-processing');
const { verifyAgentRequest } = require('./request-verifier');
const { isImageUrl, writeResponse } = require('./util');
const { attachmentProcessing } = require('./attachment-processing');
const { chatProcessing } = require('./gh-model-client');
const ChatResponseMessage = require('./messages');

const express = require('express')
const bodyParser = require('body-parser');
const app = express()
// Middleware to capture raw request body
app.use(bodyParser.raw({ type: 'application/json' }));
// Middleware to parse JSON body
app.use(bodyParser.json());

const GITHUB_KEYS_URI = process.env.GITHUB_KEYS_URI;

// Serve the home page
app.get('/', (req, res) => {
  res.send('Hello from Copilot Extension')
})

// Handle incoming chat messages
app.post('/', async (req, res) => {

  console.log('Request received');

  // getting user token from the request
  const token = req.headers["x-github-token"];

  // verify the request payload
  const rawBody = req.body.toString('utf8');
  const result = await verifyAgentRequest(rawBody,req,GITHUB_KEYS_URI);
  if (result.status) {
    // Parse the raw body to JSON if you need the JSON object
    let jsonBody=null;
    try {
      jsonBody = JSON.parse(rawBody);
    } catch (err) {
      console.error('Error parsing JSON:', err.message);
      return res.status(400).send('Invalid JSON');
    }

    let messages = [];
    if (jsonBody) {
       messages = jsonBody.messages;
       let content = messages[messages.length - 1].content;
       let name = messages[messages.length - 1].name;
      //for (const { role, content, name } of jsonBody.messages) {
        console.log("Verifying the message");
        if (content && !name) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const matches = content.match(urlRegex);

          // user message contains URL
          if (matches) {
            console.log('URL exists in the message');
            const imageUrl = matches[0];
            // Check if the URL is an image URL
            console.log('Checking if the URL is an image URL');
            if (isImageUrl(imageUrl)) {

              const textWithoutUrl = content.replace(urlRegex, '').trim();

              // Check and retrieve image from GitHub repository
              console.log('Checking and retrieving image from GitHub repository');
              const ghImageResult = await getImageFromRepo(res,token,imageUrl);

              // If the URL is a GitHub repository URL, fetch the image from the repository
              console.log('Checking the result from the GitHub repository');
              if (ghImageResult.status) {
                console.log(`Base64 Image: created`);
                messages.push({
                  role: "user",
                  content: [
                    { type: "text", text: textWithoutUrl },
                    {
                      type: "image_url", "image_url": {
                        "url": "data:image/png;base64," + ghImageResult.image
                      }
                    }
                  ]
                });
              }else {
                // Adding public image URL to the messages
                console.log(`Adding public image URL to the messages`);
                messages.push({
                  role: "user",
                  content: [
                    { type: "text", text: textWithoutUrl },
                    { type: "image_url", image_url: { url: imageUrl, details: "low" } }
                  ]
                });
              }
              console.log(`Chat message processing using GitHub Models`);
              console.log(`Messages:`+ JSON.stringify(messages));
              await chatProcessing(messages,token, res);

            } else {
              writeResponse(res,ChatResponseMessage.INVALID_IMAGE_URL);
            }

          } else {
            // Check for attachments
            console.log('Checking for attachments');
            await attachmentProcessing(jsonBody,res, token);
          }
        }else{
          //TODO
          console.log('TODO: No content or not name in last message');
          console.log(jsonBody.messages);
        }
      //};
    } else {
      console.log('No messages in request');
      writeResponse(res,ChatResponseMessage.IMG_INTRO);
    }
  } else {
    console.log('Request verification failed');
    writeResponse(res, result.message);
  }
  // Stop message rendering
  writeResponse(res=res,content= "",finish_reason="stop");
  res.end();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT)
