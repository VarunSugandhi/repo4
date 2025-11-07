# Synapse — Your AI Learning Companion

Built by Team Nether Watchers | Team ID: 70

---

## Team Details

### Team Lead  
**Name:** Varun S  
**Domain:** Education P2  
**Email:** [varunsugandhi0@gmail.com](mailto:varunsugandhi0@gmail.com)

### Team Members  
- Abhishek Jain  
- Ankit Gowda M C  
- Anusha A T  
- S Haripriya  

---

## Project Overview

Synapse is an AI-powered education platform designed to make learning interactive, intelligent, and human-like.  
It converts any document or topic into a multimodal study experience — combining summaries, podcasts, mind maps, flashcards, and YouTube lectures — all powered by advanced AI models.

---

## Key Features

### Report Generator
Generates a well-structured academic report from uploaded documents or searched topics, including abstract, problem statement, and references.

### Audio Overview (AI Podcast)
Creates a conversational podcast between two AIs, where one asks questions and the other explains concepts using research context.

### Video Overview
Generates a short visual explainer video from the topic’s summary with narration and highlights.

### Mind Map Generator
Converts summaries or selected YouTube lecture links into interactive visual mind maps to help learners understand relationships between ideas.

### Flashcards
Creates concise, question-and-answer-based flashcards from the summary content to support quick revision and retention.

### Exam Prepometer
A personalized exam preparation module that allows users to:
1. Enter their grade and examination board  
2. View all subjects and chapters  
3. Access previous year question papers  
4. Open papers in Notebook Mode to:
   - Write or generate AI-assisted answers  
   - Use all Synapse tools (report, podcast, mind map, flashcards) within the paper interface  
5. Track preparation progress with a live Prepometer Score

### YouTube Research Panel
Displays verified YouTube educational videos related to the user’s search or uploaded content.  
Clicking a video opens it in a new tab for instant learning.

---

## AI Stack

| Function | Technology Used |
|-----------|----------------|
| Text Analysis, Summaries, Reports | OpenRouter AI |
| Document Understanding, Research, Video | Cerebras AI |
| Text-to-Speech / Podcast / Flashcards | Fireworks AI |
| Video Lectures | YouTube Data API |
| Mind Maps | ReactFlow / Mermaid.js |
| Frontend | React, TypeScript, Tailwind, shadcn-ui, Vite |
| Backend | Node.js, Express, Supabase / MongoDB |

---

## Development and Setup

### Prerequisites
- Node.js and npm installed ([via nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/VarunSugandhi/NetherWatchers_70.git

# 2. Navigate to the directory
cd NetherWatchers_70

# 3. Install dependencies
npm i

# 4. Start the development server
npm run dev
