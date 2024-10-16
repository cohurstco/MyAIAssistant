from fastapi import FastAPI
from flask import Flask, render_template, request
import uvicorn
from bs4 import BeautifulSoup
import requests
import asyncio
from urllib.parse import urljoin, urlparse
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import xml.etree.ElementTree as ET
from langchain import hub
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter

app = FastAPI()
flask_app = Flask(__name__)

# ... (keep all existing functions)

@app.get("/api/crawl")
async def crawl_sitemap(url: str):
    # Placeholder implementation
    return {"message": "Crawl functionality not yet implemented"}

@app.get("/api/rag")
async def rag_query(url: str, query: str):
    # Load the content of the URL
    loader = WebBaseLoader(web_paths=[url])
    docs = loader.load()

    # Split the document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    # Create a vector store
    vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings())

    # Create a retriever
    retriever = vectorstore.as_retriever()

    # Load the RAG prompt
    prompt = hub.pull("rlm/rag-prompt")

    # Create the RAG chain
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    
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

@flask_app.route('/')
def index():
    return render_template('index.html')

@flask_app.route('/crawl', methods=['POST'])
async def crawl():
    url = request.form['url']
    result = await crawl_sitemap(url)
    if 'sitemaps' in result:
        df = pd.DataFrame(result['sitemaps'])
        return render_template('result.html', sitemaps=df.to_dict(orient='records'))
    else:
        return render_template('result.html', error=result.get('error', 'Unknown error occurred'))

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
