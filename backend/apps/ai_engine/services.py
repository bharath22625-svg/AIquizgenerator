import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

def generate_mcqs(text, difficulty, num_questions):

    prompt = f"""
    Generate exactly {num_questions} multiple choice questions
    from the following text.

    Difficulty level: {difficulty}

    Return ONLY a single valid JSON object. DO NOT output any text, markdown, or explanation before or after the JSON.
    Ensure all strings are properly escaped.

    Format:
    {{
      "questions": [
        {{
          "question": "question here",
          "options": [
            "option1",
            "option2",
            "option3",
            "option4"
          ],
          "correct_answer": "correct option",
          "explanation": "brief explanation of why the correct option is correct"
        }}
      ]
    }}

    Text:
    {text[:3000]}
    """

    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )

        response.raise_for_status()
        data = response.json()
        
        raw_response = data["choices"][0]["message"]["content"]

        # Extract valid JSON only
        start = raw_response.find("{")
        end = raw_response.rfind("}") + 1

        if start == -1 or end == 0 or end <= start:
            raise ValueError(f"Could not find JSON object in response. Raw output: {raw_response[:200]}...")

        json_text = raw_response[start:end]
        parsed_data = json.loads(json_text)
        
        parsed_questions = parsed_data.get("questions", [])
        if not parsed_questions:
             raise ValueError("JSON response missing 'questions' array.")

        return parsed_questions

    except requests.exceptions.HTTPError as e:
        error_msg = e.response.text
        return {
            "error": f"Groq API Error: {error_msg}"
        }
    except Exception as e:
        return {
            "error": f"AI Engine parsing error: {str(e)}"
        }