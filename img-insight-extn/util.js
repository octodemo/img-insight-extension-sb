function writeResponse(res, 
    content,
    id = "chatcmpl-123",
    object = "chat.completion.chunk",
    model = "gpt-4-1106-preview",
    system_fingerprint = "fp_44709d6fcb",
    index = 0,
    logprobs = null,
    finish_reason = null
) {
    if (!res.headersSent) {
        // Set the appropriate headers
        res.setHeader('Content-Type', 'application/json');
      } 

    const data = {
        "id": id,
        "object": object,
        "created": (new Date()).getTime(),
        "model": model,
        "system_fingerprint": system_fingerprint,
        "choices": [
            {
                "index": index,
                "delta": {
                    "content": content
                },
                "logprobs": logprobs,
                "finish_reason": finish_reason
            }
        ]
    };

    // Stream the JSON data back to the response
    res.write(`data: ${JSON.stringify(data)}\n\n`, (err) => {
        if (err) {
            console.error(`Error writing first chunk: ${err}`);
        }
        console.log('Custom message was written!');
    });
}

function isImageUrl(url) {
    const imagePattern = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imagePattern.test(url);
}

module.exports = { isImageUrl, writeResponse };