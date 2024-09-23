
<img width="250" alt="img-insight-icon1" src="https://github.com/user-attachments/assets/4b1a1595-6a59-4d49-b363-486d518bace7" />

# Copilot Extension - Image Insight

The Copilot Extension processes image files to generate code snippets from visual data, analyze and interpret architecture diagrams, and convert diagram-based logic into code. It can extract key information to create class files, model data from images, and identify target resource requirements. Additionally, it generates test cases from visual flows and parses network topology diagrams to produce configuration scripts.

## Components:

   1. Copilot Chat: User interfacce
   2. img-insight Extension: Copilot Extension to process image
   3. GitHub Model: GPT 4o-mini model from GitHub Models for processing the user request
   4. GitHub Keys api: Request verification
   5. GitHub content api: Retrieve he content of attachments, if any

![img-insight components](https://github.com/user-attachments/assets/d5a1f857-7a37-4f5f-a70c-6f220730d74d)

## Features of this Extension:

  ### 1. Analyze and Interpret the Architecture Diagram
   This feature allows you to analyze and interpret architecture diagrams.

  **Sample Prompts:**
  ```
  - Explain the architecture at *image link*.
  - Explain the attached image 
  ```
  
  ### 2. Generate Class Files
  This feature helps you generate class files based on diagrams.
  
  **Sample Prompts:**
  ```
  - Create C# class files using the diagram at *image link*.
  - Create Java class files based on attached diagram
  ```
  
  ### 3. Converting Diagram-Based Logic into Code
  This feature converts logic from diagrams into code.
  
  **Sample Prompts:**
  ```
  - Convert this logic into a JavaScript function *image link*.
  - Create Python code based on the attached flow-chart
  ```
  
  ### 4. Image-Based Data Modeling
  This feature generates SQL create statements using entities defined in images.
  
  **Sample Prompts:**
  ```
  - Generate SQL create statements using the entities defined at *image link* .
  ```
  
  ### 5. Identify Target Resource Requirements
  This feature identifies the Azure resources utilized in architecture diagrams.
  
  **Sample Prompts:**
  ```
  - What are the Azure resources utilized in *image link* 
  ```
  
  ### 6. Generating Test Cases from Visual Flows
  This feature generates unit test cases using JUnit to address functionality defined in visual flows.
  
  **Sample Prompts:**
  ```
  - Generate unit test cases using JUnit to address the functionality defined at *image link*.
  ```
  
  ### 7. Parse Network Topology Diagrams to Generate Configuration Scripts
  This feature generates configuration scripts based on network topology diagrams.
  
  **Sample Prompts:**
  ```
  - Generate configuration scripts for the diagram at *image link*.
  ```

 ### 8. Screen Design to code
  This feature convert a web or mobile design into code by extracting style and page components
  
  **Sample Prompts:**
  ```
  - Create html and css files for the design share *image link or attachment*.
  ```

## Demo

[![Watch the video](../assets/img-insight-screenshot.png)]()

## Local Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/octodemo/amb-copilot-extensions.git
   
   ```
2. Create a new `.env` file in the root directory of your project.
   Add the following line to the `.env` file:

    ```properties
    GITHUB_KEYS_URI=https://api.github.com/meta/public_keys/copilot_api
    ```

3. **Install the Required Dependencies**
   Navigate to the `img-insight-extn` directory and install the dependencies:
   ```bash
   cd img-insight-extn
   npm install
   ```

4. **Run the App**
   Start the Angular application:
   ```bash
   npm start
   ```

5. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Deployment to Azure
1. Establish OIDC Connectivity with Microsoft Entra ID by refering the [documentation](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect#getting-started-with-oidc)
   - Add the following secrets to GitHub Secrets:
     ```properties
     AZURE_CLIENT_ID - Your Azure client ID
     AZURE_AD_TENANT - Your Azure AD tenant
     AZURE_SUBSCRIPTION_ID  -  Your Azure subscription ID
     ```
2. Create a Web applicaton to host the extension
3. Update the `Environment Variables` in the Azure Web application with the following:
   ```properties
   GITHUB_KEYS_URI=https://api.github.com/meta/public_keys/copilot_api
   ``` 
4. Update the `app-name` input for the workflow [Node Deploy](.github/workflows/node-deploy.yml) with the Azure Web application name
5. Trigger the workflow by selecting the `pack-name=img-insight-extn` and clicking on `Run workflow`
