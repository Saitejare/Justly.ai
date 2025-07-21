# JustlyAI Project Overview

## Technologies Used

- **Frontend:** React (TypeScript), CSS Modules, Styled Components
- **Backend:** Python, Flask, Flask-CORS
- **AI/NLP:**
  - Sentence Transformers (for semantic search)
  - Hugging Face Transformers (for LLM training/inference, if used)
- **Data:** Custom legal Q&A in `data.json` (JSONL format)
- **Other:**
  - scikit-learn (cosine similarity)
  - Node.js/npm (for frontend dependencies)

---

## Project Structure

- `justlyai-ui/` — React frontend for chat interface
- `mini-chatbot/llm_api.py` — Flask backend for answering user queries
- `data.json` — Legal Q&A pairs for retrieval and training
- (Optional) `LLM.py` — Script for training/fine-tuning a language model

---

## Implementation Details

### 1. **Frontend (React UI)**
- Users interact with a chat interface built in React.
- When a user sends a message, the UI POSTs the message to the backend `/generate` endpoint.
- Quick actions (Emergency Help, Settlement Tips, Court Prep) are available as buttons and send predefined queries.
- The UI displays both user messages and assistant responses.

### 2. **Backend (Flask API)**
- The backend exposes a `/generate` endpoint.
- On receiving a user query, it uses a sentence transformer model to embed the query and all questions in `data.json`.
- It finds the most semantically similar question in the data using cosine similarity.
- If the similarity is above a threshold, it returns the corresponding answer; otherwise, it returns a default message.
- (Optional) If using a trained LLM, the backend loads the model and generates answers for user queries.

### 3. **Data (data.json)**
- Contains legal Q&A pairs, each as a JSON object with `user` and `assistant` fields.
- Covers topics like emergency help, fines, settlements, court preparation, and more.
- Emergency help answers include sample contacts and legal steps.

---

## How the Project Works

1. **User opens the React UI and sends a question.**
2. **Frontend sends the question to the Flask backend at `/generate`.**
3. **Backend finds the most relevant answer from `data.json` using semantic search.**
4. **Backend returns the answer, which is displayed in the chat UI.**
5. **For quick actions, predefined questions are sent and matched to specific answers.**

---

## Key Features
- Fast, retrieval-based legal Q&A using your own data.
- Semantic search allows for flexible, natural language queries.
- Easily extensible: add more Q&A pairs to `data.json` as needed.
- Clean separation of training (LLM.py) and inference (llm_api.py).
- No sensitive data is sent to third-party APIs; all processing is local.

---

## How to Extend
- Add more Q&A pairs to `data.json` for broader coverage.
- Fine-tune an LLM with `LLM.py` for generative answers (optional, requires more resources).
- Improve the UI with more features (history, user authentication, etc.).
- Deploy the backend with a production WSGI server for real-world use.

---

## Authors & Credits
- Project by [Your Name/Team]
- Uses open-source models and libraries from Hugging Face, Sentence Transformers, Flask, React, and more. 