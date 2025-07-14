
# Googoal Backend Setup

## Prerequisites
- Python 3.8 or higher
- pip package manager

## Quick Start

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the backend:**
```bash
python src/api/search.py
```

The backend will run on `http://localhost:5000`

## How it works

The backend uses:
- **DuckDuckGo API** for search results (no API key needed)
- **OpenAI GPT-3.5-turbo** for AI summaries
- **Flask** with CORS enabled for the frontend

## API Endpoint

### POST /api/search
Search and get AI-powered summaries.

**Request:**
```json
{
  "query": "your search query"
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "snippet": "Content snippet...",
      "aiSummary": "AI-generated summary"
    }
  ]
}
```

## Testing
1. Start the backend: `python src/api/search.py`
2. Test with curl:
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "artificial intelligence"}'
```

## Notes
- The OpenAI API key is embedded in the code for demo purposes
- DuckDuckGo API is used for search (free, no rate limits)
- CORS is enabled for frontend integration
