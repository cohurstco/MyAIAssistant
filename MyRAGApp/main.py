import os
from dotenv import load_dotenv
from fastapi import FastAPI
from flask import Flask, render_template, request, jsonify
import uvicorn
from bs4 import BeautifulSoup
import requests
import asyncio
from urllib.parse import urljoin, urlparse
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import xml.etree.ElementTree as ET
from langchain import hub
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# Disable LangSmith tracing
os.environ["LANGCHAIN_TRACING_V2"] = "false"

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
flask_app = Flask(__name__)

# Get OpenAI API key from environment variable
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Global variable to store the vector store
vectorstore = None

@app.get("/api/crawl")
async def crawl_sitemap(url: str):
    # Placeholder implementation
    return {"message": "Crawl functionality not yet implemented"}

@app.get("/api/maia/load")
async def load_webpage(url: str):
    global vectorstore
    
    # Load the content of the URL
    loader = WebBaseLoader(url)
    docs = loader.load()
    
    # Print the contents of the page to the console
    print(f"Contents of {url}:")
    for doc in docs:
        print(doc.page_content)
    
    # Split the document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    
    # Create a vector store
    vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings(openai_api_key=openai_api_key))
    
    return {"message": "Webpage loaded and vectorized successfully"}

@app.get("/api/maia/query")
async def maia_query(query: str):
    global vectorstore
    
    if not vectorstore:
        return {"error": "No webpage has been loaded. Please load a webpage first."}
    
    # Create a retriever
    retriever = vectorstore.as_retriever()
    
    # Load the RAG prompt
    prompt = hub.pull("rlm/rag-prompt")
    
    # Create the RAG chain
    llm = ChatOpenAI(model_name="gpt-4", temperature=0, openai_api_key=openai_api_key)
    
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)
    
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    # Run the query
    response = rag_chain.invoke(query)
    
    return {"answer": response}

@app.get("/api/view_vectorstore")
async def view_vectorstore():
    global vectorstore
    
    if not vectorstore:
        return {"contents": []}
    
    # Retrieve all documents from the vector store
    documents = vectorstore.get()
    
    # Extract the content from each document
    contents = [doc.page_content for doc in documents]
    
    return {"contents": contents}

@flask_app.route('/')
def index():
    return render_template('index.html')

@flask_app.route('/sitemap_crawler')
def sitemap_crawler():
    return render_template('sitemap_crawler.html')

@flask_app.route('/maia')
def maia():
    return render_template('maia.html')

@flask_app.route('/crawl', methods=['POST'])
async def crawl():
    url = request.form['url']
    result = await crawl_sitemap(url)
    if 'sitemaps' in result:
        df = pd.DataFrame(result['sitemaps'])
        return render_template('sitemap_result.html', sitemaps=df.to_dict(orient='records'))
    else:
        return render_template('sitemap_result.html', error=result.get('error', 'Unknown error occurred'))

@flask_app.route('/maia/load', methods=['POST'])
async def load_maia():
    url = request.form['url']
    result = await load_webpage(url)
    return jsonify(result)

@flask_app.route('/maia/query', methods=['POST'])
async def query_maia():
    query = request.form['query']
    result = await maia_query(query)
    return jsonify(result)

def run_flask():
    flask_app.run(host="0.0.0.0", port=5000)

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)

async def main():
    with ThreadPoolExecutor(max_workers=2) as executor:
        flask_future = executor.submit(run_flask)
        fastapi_future = executor.submit(run_fastapi)

        await asyncio.gather(
            asyncio.to_thread(flask_future.result),
            asyncio.to_thread(fastapi_future.result)
        )

if __name__ == "__main__":
    asyncio.run(main())
