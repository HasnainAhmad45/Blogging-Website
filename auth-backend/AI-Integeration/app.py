from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get API key from environment variable (NEVER hardcode!)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("⚠️  ERROR: GROQ_API_KEY not found!")

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Content Generator API - Powered by Groq",
        "status": "running",
        "api_key_configured": bool(GROQ_API_KEY)
    })

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok" if GROQ_API_KEY else "error",
        "model": "llama-3.1-8b-instant",
        "provider": "Groq",
        "api_key_set": bool(GROQ_API_KEY)
    })

@app.route("/generate", methods=["POST"])
def generate_text():
    if not GROQ_API_KEY:
        return jsonify({
            "error": "API key not configured",
            "details": "Set GROQ_API_KEY in .env file"
        }), 500
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400
    
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    system_message = data.get("system_message", "You are a helpful AI assistant.")
    temperature = data.get("temperature", 0.7)
    max_tokens = data.get("max_tokens", 1000)

    try:
        print(f"📝 Generating response for: {prompt[:50]}...")
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt}
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
                "top_p": 0.9
            },
            timeout=30
        )
        
        if response.status_code != 200:
            error_data = response.json()
            return jsonify({
                "error": f"Groq API Error: {response.status_code}",
                "details": error_data.get("error", {}).get("message", "Unknown error")
            }), response.status_code
        
        result = response.json()
        ai_text = result["choices"][0]["message"]["content"]
        
        print("✅ Generated successfully!")
        return jsonify({
            "response": ai_text,
            "model": "llama-3.1-8b-instant"
        })

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print(f"📍 Server: http://127.0.0.1:5000")
    
    app.run(host="127.0.0.1", port=5000, debug=True, threaded=True)