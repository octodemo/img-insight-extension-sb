const { isImageUrl, writeResponse } = require('./util');
const { getImageFromRepo } = require('./gh-img-processing');
const { chatProcessing } = require('./gh-model-client');
const ChatResponseMessage = require('./messages');

async function attachmentProcessing(jsonBody, res, token) {
  console.log('Attachment processing started');
  let content = "";
  if (jsonBody.messages) {
    const messages = jsonBody.messages;
    let content = messages[messages.length - 1].content;
    console.log('Content:', content);
    const checkMessages = (messages) => {
      return messages.map(message => {
        const redactedRef = message.copilot_references && message.copilot_references.find(ref =>
          ref.type === "github.redacted" && ref.data.type === "github.file"
        );
        const fileRef = message.copilot_references && message.copilot_references.find(ref =>
          ref.type === "github.file" && ref.data.type === "file"
        );

        if (redactedRef) {
          return { type: 'redacted', result: redactedRef };
        } else if (fileRef) {
          return { type: 'url', result: fileRef.data.url };
        }
      });
    };

    const result = checkMessages(messages);
    console.log('result', result);
    let urlFound = null;
    let redactedFound = false;

    result.forEach(res => {
      if (res && res.type === 'url') {
        urlFound = res.result;
      } else if (res && res.type === 'redacted') {
        redactedFound = true;
      }
    });

    if (urlFound) {
      console.log('URL attachment found');
      console.log('URL', urlFound);

      //check the URL is imageUrl or not
      if (isImageUrl(urlFound)) {
        // Check and retrieve image from GitHub repository
        const ghImageResult = await getImageFromRepo(res,token,urlFound);

        // If the URL is a GitHub repository URL, fetch the image from the repository
        if (ghImageResult.status) {
          console.log(`Base64 Image: created`);
          messages.push({
            role: "user",
            content: [
              { type: "text", text: content },
              {
                type: "image_url", "image_url": {
                  "url": "data:image/png;base64," + ghImageResult.image
                }
              }
            ]
          });
          await chatProcessing(messages, token, res);
        }else{
          writeResponse(res, ChatResponseMessage.IMG_ACCESS_ISSUE+ urlFound);
        }
      }else{
        writeResponse(res,ChatResponseMessage.INVALID_IMAGE_URL);
      }
    } else if (redactedFound) {
      console.log('Redacted attachment found');
      writeResponse(res,ChatResponseMessage.IMG_REDACTED);
    } else {
      console.log('There is no attachment in the message');
      writeResponse(res,ChatResponseMessage.NO_ATTACHMENT); 
    }
  }
  console.log('Attachment processing completed');
}
module.exports = { attachmentProcessing };