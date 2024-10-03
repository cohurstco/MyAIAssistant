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

app = FastAPI()
flask_app = Flask(__name__)

def parse_xml_sitemap(content, url):
    try:
        root = ET.fromstring(content)
        ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

        xmlns = root.attrib.get('xmlns', '')
        urls = []
        for url_elem in root.findall('.//sm:url', ns):
            url_info = {"xmlns": xmlns, "sitemap_type": "XML"}
            for child in url_elem:
                tag = child.tag.split('}')[-1]  # Remove namespace prefix
                url_info[tag] = child.text
            urls.append(url_info)

        return pd.DataFrame(urls)
    except ET.ParseError:
        print(f"Error parsing XML sitemap: {url}")
        return pd.DataFrame()

def parse_html_sitemap(content, base_url):
    sitemaps = []
    soup = BeautifulSoup(content, 'html.parser')
    for a in soup.find_all('a', href=True):
        href = a['href']
        if 'sitemap' in href.lower():
            full_url = urljoin(base_url, href)
            sitemaps.append({"loc": full_url, "sitemap_type": "HTML"})
    return pd.DataFrame(sitemaps)

async def check_common_sitemap_locations(base_url):
    common_paths = ['/sitemap.xml', '/sitemap_index.xml', '/robots.txt']
    sitemaps = []

    async with requests.ClentSession() as session:
        task = [check_url(session, path) for path in common_paths]
        await asyncio.gather(*task)
        
    async def check_url(session, path):
        url = urljoin(base_url, path)
        try:
            async with session.get(url, timeout=5) as response:
                if response.status == 200:
                    if path == '/robots.txt':
                        await process_robots_txt(response, sitemaps)
                else:
                    sitemaps.append({"loc": url, "sitemap_type": "Common Location"})
        except (requests.RequestException, asyncio.TimeoutError):
            pass

    return pd.DataFrame(sitemaps)

async def process_robots_txt(response, sitemaps):
    text = await response.text()
    for line in text.splitlines():
        if line.lower().startswith('sitemap:'):
            sitemap_url = line.split(':', 1)[1].strip()
            sitemaps.append({"loc": sitemap_url, "sitemap_type": "Robots.txt"})

def search_google_for_sitemap(domain):
    search_url = f"https://www.google.com/search?q=site:{domain}+inurl:sitemap"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

    try:
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        sitemaps = []
        for result in soup.find_all('div', class_='yuRUbf'):
            link = result.find('a')
            if link and 'href' in link.attrs:
                url = link['href']
                if 'sitemap' in url.lower():
                    sitemaps.append({"loc": url, "sitemap_type": "Google Search"})

        return pd.DataFrame(sitemaps)
    except requests.RequestException:
        return pd.DataFrame()

@app.get("/api/crawl")
async def crawl_sitemap(url: str):
    try:
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

        # Check common locations first
        sitemaps_df = await check_common_sitemap_locations(base_url)

        if sitemaps_df.empty:
            # If no sitemaps found in common locations, try the provided URL
            async with requests.Session() as session:
                async with session.get(url) as response:
                    response.raise_for_status()
                    content = await response.content()

            sitemaps_df = parse_xml_sitemap(content, url)

            # If no XML sitemaps found, try parsing as HTML
            if sitemaps_df.empty:
                sitemaps_df = parse_html_sitemap(content, url)

        # If still no sitemaps found, try Google search as a last resort
        if sitemaps_df.empty:
            sitemaps_df = search_google_for_sitemap(parsed_url.netloc)

        return {"sitemaps": sitemaps_df.to_dict(orient='records')}
    except requests.RequestException as e:
        return {"error": f"Request error: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}

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
