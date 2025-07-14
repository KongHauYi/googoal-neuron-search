
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import openai
import os
import time

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = "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"

def search_duckduckgo(query):
    """Simple search using DuckDuckGo API"""
    try:
        search_url = f"https://api.duckduckgo.com/?q={query}&format=json&no_html=1&skip_disambig=1"
        response = requests.get(search_url, timeout=10)
        data = response.json()
        
        results = []
        
        # Get instant answer if available
        if data.get('AbstractText'):
            results.append({
                'title': data.get('Heading', query),
                'url': data.get('AbstractURL', '#'),
                'snippet': data.get('AbstractText', ''),
                'aiSummary': ''
            })
        
        # Get related topics
        if data.get('RelatedTopics'):
            for topic in data.get('RelatedTopics', [])[:5]:
                if isinstance(topic, dict) and topic.get('Text') and topic.get('FirstURL'):
                    results.append({
                        'title': topic.get('Text', '').split(' - ')[0][:100],
                        'url': topic.get('FirstURL', '#'),
                        'snippet': topic.get('Text', ''),
                        'aiSummary': ''
                    })
        
        # If no results, create demo result
        if not results:
            results.append({
                'title': f'Search results for: {query}',
                'url': '#',
                'snippet': f'No direct results found for "{query}". This is a demo search engine that would normally scrape web content.',
                'aiSummary': ''
            })
        
        return results
        
    except Exception as e:
        print(f"Search error: {e}")
        return [{
            'title': f'Search: {query}',
            'url': '#',
            'snippet': f'Error occurred while searching for "{query}". This would normally be handled by robust web scraping.',
            'aiSummary': ''
        }]

def generate_ai_summary(content, query):
    """Generate AI summary using OpenAI"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a nerdy, technical search assistant. Provide concise, accurate summaries that highlight the most relevant technical details for developers and tech enthusiasts. Keep it under 100 words and make it engaging for nerds."
                },
                {
                    "role": "user",
                    "content": f"Summarize this content related to the search query '{query}':\n\n{content[:1000]}"
                }
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"AI summary error: {e}")
        return "AI summary temporarily unavailable."

@app.route('/api/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        print(f"Processing search query: {query}")
        
        # Search for results
        results = search_duckduckgo(query)
        
        # Generate AI summaries for each result
        for result in results:
            result['aiSummary'] = generate_ai_summary(result['snippet'], query)
            time.sleep(0.1)  # Small delay to avoid rate limits
        
        print(f"Returning {len(results)} results with AI summaries")
        
        return jsonify({'results': results})
        
    except Exception as e:
        print(f"Error in search endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
