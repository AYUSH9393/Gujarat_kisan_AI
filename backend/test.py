import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Use the correct model name
model = genai.GenerativeModel('models/gemini-2.5-flash')

response = model.generate_content("Say hello in Gujarati")
print(response.text)