
# Googoal Backend Setup

## Prerequisites
- Python 3.8 or higher
- pip package manager

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python src/api/search.py
```

The backend will run on `http://localhost:5000`

## API Endpoints

### POST /api/search
Search and scrape web content with AI summaries.

**Request:**
```json
{
  "query": "your search query or URL"
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "summary": "AI-generated summary",
      "content": "Content preview..."
    }
  ]
}
```

## Environment Variables
Set your OpenAI API key in the search.py file or as an environment variable:
```bash
export OPENAI_API_KEY="your-api-key"
```
