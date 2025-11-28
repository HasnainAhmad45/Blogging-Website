from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load a free Hugging Face text-generation model
# GPT-Neo 125M is a small, CPU-friendly model
generator = pipeline("text-generation", model="EleutherAI/gpt-neo-125M")

@app.route("/", methods=["GET"])
def home():
    return """
    <h2>Free AI Text Generator</h2>
    <p>Use POST /generate with JSON {"prompt": "your text"} to get AI response.</p>
    """

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Prompt is required"}), 400

    prompt = data["prompt"]

    try:
        # Generate text
        result = generator(prompt, max_length=150, do_sample=True, temperature=0.7)
        output = result[0]['generated_text']
    except Exception as e:
        output = f"Error generating text: {str(e)}"

    return jsonify({"response": output})

if __name__ == "__main__":
    app.run(debug=True)
