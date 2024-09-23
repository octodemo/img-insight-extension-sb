const { writeResponse } = require('./util');
const { Buffer } = require('buffer');

// Function to dynamically import node-fetch
async function fetchModule() {
  return await import('node-fetch');
}

// Open the image file and encode it as a base64 string
async function blobToBase64(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

// Fetch the image from the GitHub repository
async function getImageFromRepo(res,token, imageUrl) {

  // Check if the URL is a GitHub repository URL
  const githubRepoRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/[^\/]+\/(.+)$/;
  const ghMatches = imageUrl.match(githubRepoRegex);

  console.log(`GH check completed`);
  // If the URL is a GitHub repository URL, fetch the image from the repository
  if (ghMatches) {

    const owner = ghMatches[1];
    const repo = ghMatches[2];
    const filePath = ghMatches[3];

    console.log(`Fetching image from GitHub repository: ${owner}/${repo}/${filePath}`);
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const { default: fetch } = await fetchModule();
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw' // Ensure raw content
      }
    });

    if (!response.ok) {
      writeResponse(res, `GitHub API returned an error: ${response.statusText}`);
    }

    const imageBlob = await response.blob();
    //const imageUrl = URL.createObjectURL(imageBlob);
    const base64Image = await blobToBase64(imageBlob);
    console.log(`Image fetched and converted to base64`);
    return {"status":true, "image": base64Image};
  }else{
    return {"status":false, "image": ""};
  }

};

module.exports = { getImageFromRepo };