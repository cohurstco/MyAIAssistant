# (MAI) MyAI Assistant Application

Note Purpose:  My notes on the first build of my "MyAIAssistant" app.

App Metadata

App Name: My AI Assistant
Author:
Code Repo:

Application Purpose

An artificially intelligent personal assistant

The app will use a serverless architecture with functions for different knowledge domains stored in Redis and DynamoDB tables based on working memory and priority. The backend functions will also manage data storage and deletion to reduce costs and keep database sizes small. The services will cover higher concepts and detailed subtypes, categories, and topic domains. It will call Lambda functions with trained LLMs to generate answers, GraphQL API to supply data, and graph database to store object relationships. The app will also use various databases for different types of data, input data from multiple sources, and use AWS Eventbridge and S3 for organizing and refining data.

This is a note-taking app that will act as your assistant and help you do tasks like taking notes for yourself, collecting related research, summarizing important information, helping brainstorm, distilling, asking and answering follow-up questions, and posting finished work to social media and blogs.
It will be a standalone application with plugins and API calls to other tools, such as Evernote, Google Drive, Google Calendar, and various other features.

A note-taking app with AI capabilities will be able to collect data from various media forms and sources, translate languages, and summarize content for easy consumption. It will also organize the collected information based on the user's goals and priorities, utilizing caching, tagging, and grouping methods for easy retrieval and management. The app will aid in time management through goal setting, prioritization, planning, and removing distractions while integrating with other applications and systems via APIs for seamless synchronization. The AI assistant will also enhance learning, idea generation, content creation, and habit tracking while safeguarding data through encryption and privacy-focused measures. Stretch goals include digital workspace capabilities, bias understanding, integration with virtual assistants, and optimized data management using metadata tables and indexes.

The note-taking app has several essential features, including robust collection, task management, personal knowledge management (PKM) using PARA, CODE system, offline mode, caching, and server-side rendering. The app aims to provide a digital workspace for knowledge management and should be able to identify bias in text and integrate with Google Assistant for voice commands. Requirement conflicts and redundant requirements have been identified, and recommendations have been made to clarify the interaction between collecting and organizing features, prioritize the distilling feature, merge redundant requirements, evaluate the importance of understanding bias, and ensure a well-planned integration with Google Assistant. The focus is refining the app's requirements to provide a more focused and effective development process and address common themes, additional requirements, requirement conflicts, and redundant requirements. The note-taking app can meet essential requirements and provide a comprehensive and efficient user experience by addressing these areas.

Want to have an app that is an AI Assistant that could help us by symbiotically helping each other grow mentally and physically to live healthy and longer lives.

Components

Frontend

UI

Backend

Data Generation

Features

- Essential Note-Taking: Create, edit, and save notes.

- Resource Collection: Extract and summarize essential information from documents.

- Internet Search: Integrate an essential web search function for gathering resources.

- Expanding capabilities through PWA, Zapier integrations, and task automation

- Incorporating collecting, organizing, distilling, and expressing functionalities

- Enhancing time management support, learning opportunities, and integration with other applications

- Implementing data storage, security, and privacy measures

- Stretch goals including digital workspace, bias understanding, and integration with voice assistants
  - What kind of tasks would you like your artificial assistant to help with? (e.g., reminders, scheduling, note-taking, etc.)
- Would you like the application to have a user-friendly interface or a more functional one?
  - Are there any specific features you'd like to include, such as:
    - Task prioritization
    - Due dates and reminders
    - Categorization (e.g., work/school, personal, etc.)
    - Collaboration with others
    - Integration with other apps or services

- What kind of data storage would you prefer? Would you like the application to store data locally on your device or sync it with a cloud service?

- Are there any specific platforms (e.g., web, mobile, desktop) or devices on which you'd like the application to be available?

- Utilizes serverless architecture with functions supported by Redis and DynamoDB

- Uses Eisenhower Matrix and PARA method for prioritization of goals

- Incorporates GraphQL for efficient data retrieval and manipulation

- Implements various security measures for communication with external sources

- Utilizes different databases for different data types and input methods

Resource(s)

Concepts:

Speed Reading Tips
Critical Reading Methods
How to summarize
Progressive Summarization: A Practical Technique for Designing Discoverable Notes - Forte Labs
Personal Knowledge Management (PKM)
Building a Second Brain
Task Bracketing
Ways to increase my output in the New Digital Age

AI Agents(s)

My AI Code Assistant System Prompt
My Developer AI Assistant
More AI Assistant Requirements
About Me
Feature Requirements for My AI Assistant
More My AI Assistant Requirements
MyAIAssistant Application Requirements
Machine Learning and Machine Assistance
AI Assistant Voice via Kits
Clean inbox

AWS Resources
AWS Skill Builder - AWS Storage Gateway Deep Dive Amazon S3 File Gateway

Feature Note(s)

Summary

Tasks

Technology

Serverless Architecture and Data Storage

- The app utilizes a serverless architecture with serverless functions for each domain of knowledge and stores information in Redis and DynamoDB tables based on working memory and priority. It also involves creating backend ETL serverless functions to manage data storage and deletion based on usage frequency.

Data Processing and Management

- The app calls Lambda functions with trained LLMs to generate answers from collected context, uses GraphQL to store data relationships, and employs scheduled or triggered functions to scrub the internet. It also emphasizes using metadata fields,  d databases for different data types and integrating various data sources.

Integration and Security Measures

- The app incorporates security measures such as two-step authentication, passkeys, authorization, JWTs, and encryption to talk to external sources. It also focuses on data processing, identifying biases and opinions in the data, and utilizing S3 systems for longer-term information and archiving.

Terminology

UI

QUICK NOTE

Notes that need to be refined and integrated

This is great! You are in my head about where these are going with automating enterprise or personal LLM-related processed domain knowledge and using personal enterprise chatbots or a personal assistant app.
Can you use AI Studio to host your Azure OpenAI deployment and then use Sementic Kernal to achieve this?
Would the cost of all of that be worth it later?
Does token cost have to come down, or can an internal solution within the app be used to cut down on the request made?
How do you keep your personal or enterprise knowledge safe?
These could be future AI guild talks.

I want an LLM and my application to work together to consider my interests, goals, and priorities and keep the context of our conversations.
It would take notes, help me remember knowledge, dates, and information, and record my data. Create content

Efficient Serverless Architecture for Personal AGI App

- The app uses serverless architecture with functions for each domain of knowledge.
- It combines the Eisenhower Matrix and the PARA method for effective prioritization.
- Backend ETL serverless functions are used to manage data storage and costs.
- .It leverages Lambda functions with trained LLMs to generate answers.
- Utilizes GraphQL for efficient data retrieval and manipulation
