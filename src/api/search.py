
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import openai
import os
import re
from urllib.parse import urlparse, urljoin
import time

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = "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"

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def scrape_website(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = soup.find('title')
        title = title.get_text().strip() if title else 'No title found'
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        # Limit content length
        content = text[:3000] if len(text) > 3000 else text
        
        return {
            'title': title,
            'content': content,
            'url': url
        }
        
    except Exception as e:
        return {
            'title': f'Error scraping {url}',
            'content': f'Failed to scrape website: {str(e)}',
            'url': url
        }

def search_web(query):
    # Simple Google search simulation
    search_urls = [
        f"https://www.google.com/search?q={query.replace(' ', '+')}"
    ]
    
    # For demo purposes, return some mock URLs
    # In production, you'd implement proper web search
    demo_urls = [
        "https://en.wikipedia.org/wiki/Artificial_intelligence",
        "https://www.openai.com",
        "https://github.com"
    ]
    
    return demo_urls[:2]  # Return first 2 URLs

def generate_ai_summary(content, query):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that creates concise, informative summaries of web content. Focus on the most relevant information related to the user's query."
                },
                {
                    "role": "user",
                    "content": f"Please create a concise summary of this content related to the query '{query}':\n\n{content[:2000]}"
                }
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        return f"Failed to generate AI summary: {str(e)}"

@app.route('/api/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        results = []
        
        # Check if query is a URL
        if is_valid_url(query):
            urls = [query]
        else:
            # Search for URLs related to the query
            urls = search_web(query)
        
        # Scrape each URL
        for url in urls[:3]:  # Limit to 3 results
            scraped_data = scrape_website(url)
            
            # Generate AI summary
            ai_summary = generate_ai_summary(scraped_data['content'], query)
            
            results.append({
                'title': scraped_data['title'],
                'url': scraped_data['url'],
                'summary': ai_summary,
                'content': scraped_data['content'][:500]  # Preview
            })
            
            # Add small delay to be respectful
            time.sleep(0.5)
        
        return jsonify({'results': results})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
