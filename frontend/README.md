# Pdf Chat

Pdf chat is a chat application that lets you communicate with your PDF files using an advanced AI chatbot. This chatbot uses the RAG framework and relies on a Mongo DB database for efficient searching, along with Cohere LLMs to provide smart interactions with your PDF knowledge base.

<!-- HTML code for side-by-side images -->
<div style="display: flex; padding: 20px; gap: 20px; flex-wrap: wrap">
    <img src="https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/pdf-chat-login.png" alt="Login" width="45%"/>
    <img src="https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/pdf-chat-new-collection.png" alt="Collections" width="45%"/>
    <img src="https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/pdf-chat-dashboard.png" alt="Collections" width="45%"/>
    <img src="https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/pdf-chat-new-pdf.png" alt="Chat Bot" width="45%"/>
    <img src="https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/pdf-chat-pdf-details.png" alt="Chat Bot Theme" width="45%"/>
    <img src="https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/pdf-chat-chat.png" alt="Chat Bot Theme" width="45%"/>
</div>

## Features

- **Authentication:** Securely log in and register.

- **Create Collections:** Organize your pdfs into collections for better management and categorization.

- **Add Pdf files:** Easily upload pdf files to a collection.

- **Embeddings with Cohere LLM:** Utilizing the Cohere LLM (Large Language Model), the app creates embeddings for the pdf files.

- **Chat with Your Files:** Engage in conversations with individual files. Ask questions or discuss about the content directly.

- **Chat with Collection:** Interact with all the files within a specific collection.

- **Knowledge Base Chat:** Finally all the files across all the collections.

## Project Overview

- **Backend** - Houses the `Node.js` REST backend, written in `TypeScript` and built with the `Fastify.js` framework. 

- **Frontend** - The UI of the app is built with `React` using `TypeScript`. Utilized the `mantine.dev` library for UI components, and `React Query` for fetching data.

- **Serverless** - Contains the serverless code written in `TypeScript`. Utilizing `AWS SAM` this component hosts a step function. Triggered by events from `AWS EventBridge`, the step function performs tasks such as creating summaries and embeddings from the pdf file. This serverless architecture ensures for efficient asynchronous tasks.

## Tech Stack

1. **Full stack Typescript:**

   - React with TypeScript for a dynamic and type-safe user interface.
   - Fastify.js with TypeScript for building a scalable and maintainable Node.js backend.

2. **Event Driven Programming:**

   - AWS EventBridge for seamless event-driven programming. When a user adds a record to MongoDB Atlas, an event triggers a serverless step function.

3. **Serverless:**

   - AWS SAM (Serverless Application Model) with TypeScript for the serverless stack.
   - Serverless step function for handling asynchronous tasks such as creating embeddings and summarizing the pdf and saving it to MongoDB Atlas.

4. **Database:**

   - MongoDB Atlas as the database platform. 
   - Using MongoDB Atlas search for vector search.
   - MongoDB SDK for Node.js, offering a straightforward database interface.

5. **Cohere LLM Platform:**

- Utilizing Cohere LLM endpoints for creating embeddings.
- Using Cohere Chat endpoint for chatbot functionality.
- Employing Cohere Re-rank endpoint to increase the relevancy of documents fetched using MongoDB Atlas vector search.

## App Workflow

1. **User Login:**

   - After logging in, the user enters the dashboard view.

2. **Collection Creation:**

   - In the dashboard, the user can create collections, for grouping related files.

3. **Collection Management:**

   - Collections are displayed on the left menu. The user can select a collection to view and manage its files, including adding new files.

4. **Pdf file Upload:**

   - When a user uploads a new pdf to a collection, the data is saved to MongoDB Atlas and it triggers an event to AWS EventBridge.

5. **Serverless Processing:**

   - AWS EventBridge triggers a serverless step function, which summarizes and creates embeddings using Cohere LLM. The data is then saved to MongoDB Atlas.

6. **Chat Functionality:**

   - Users can switch to the chat tab, where they can engage in conversations with all the files in a collection. The backend utilizes the RAG framework with the Cohere LLM platform for intelligent chat functionality.

7. **Pdf Detail Page:**

   - Clicking on a pdf file takes the user to the detail page. Switching to the chat tab on this page allows the user to engage in real-time chat with the specific file.

8. **Global Chat:**
   - On the main dashboard, users can switch to the chat tab to engage in conversations with all the files they have uploaded.

## Getting Started

To run the App locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yaldram/pdf-chat.git
   ```

2. **Start the Frontend and Backend Servers:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Create and Configure the `.env` File:**

   Create a `.env` file in the root directory of the both the folders and copy over the variables from `.env.sample`

4. **Serverless:**

   - `cd serverless/src`.
   - `npm install`
   - `cd ..`
   - `sam build`
   - `sam deploy --guided --capabilities CAPABILITY_IAM`

## Improvments

- Leverage MongoDB Atlas powerful search capabilities to enhance the search functionality for both collections and individual files.
- Implement pagination in the pdf files section to enhance the user experience.
- Improve the chat experience by displaying references for generated chat responses. Providing context or sources for the chatbot's responses.
- Continuing App Improvements

## Challenges

- Despite using Cohere's Chat API with conversationId to manage history, frequent hits on the token limit have been observed.
- The current approach involves creating a new conversationId when the frontend component mounts, with conversations stored in local storage.
- To address this challenge, exploring alternatives such as LangChain and persisting the conversations may be considered.

## Contribution Guidelines

We welcome contributions from the community! If you'd like to contribute to the project, please follow these guidelines:

- Fork the repository and create a new branch for your feature or bug fix.
- Make your changes and submit a pull request.
- Provide a clear and detailed description of your changes in the pull request.