# Sitemap Crawler

This project is a Python application that uses Flask for the UI and FastAPI for the API. It allows users to input a URL and search for XML and HTTP sitemaps to understand a website's structure.

## Setup

1. Clone this repository
2. Navigate to the project directory
3. Create a virtual environment:

   ```Python
   python -m venv venv
   ```

4. Activate the virtual environment:
   - On Windows:

     ```Python
     venv\Scripts\activate
     ```

   - On macOS and Linux:

     ```Python
     source venv/bin/activate
     ```

5. Install the required packages:

   ```Python
   pip install -r requirements.txt
   ```

## Running the Application

To run the application, use the following command:

```Python
python main.py
```

This will start both the FastAPI server and the Flask application. The application will be accessible at `http://localhost:8000`.

## Usage

1. Open a web browser and go to `http://localhost:8000`
2. Enter a URL in the input field and click "Crawl"
3. The application will search for XML and HTTP sitemaps and display the results

## API Endpoint

The FastAPI endpoint is available at `/api/crawl`. You can make a GET request to this endpoint with a `url` query parameter to get the sitemap information in JSON format.

Example:

```HTTP
GET http://localhost:8000/api/crawl?url=https://example.com
```

## Technologies Used

### PyPI libraries

fastapi==0.115.0
flask==3.0.3
uvicorn==0.31.0
requests==2.31.0
beautifulsoup4==4.12.3
pandas==2.2.3

## License
