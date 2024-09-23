// messages.js
const ChatResponseMessage = {
    IMG_INTRO: "I'm ready to assist you with generating **code snippets from images**, **explaining** image contents, or **extracting** key information from them.",
    INVALID_IMAGE_URL: "Please share a valid image URL.",
    IMG_ACCESS_ISSUE: "Unable to retrieve the image from the URL.",
    IMG_REDACTED: "Redacted attachment found.",
    NO_ATTACHMENT: "There is no attachment in the message.",
    MODEL_ERROR: "An error occurred while calling the model.",
    NO_PUBLIC_KEY: "Error: No public key found matching the key identifier.",
    PAYLOAD_ERROR: "Error: Signature does not match the payload.",
    SIGNATURE_VERIFIED: "Signature verified."
};

module.exports = ChatResponseMessage;