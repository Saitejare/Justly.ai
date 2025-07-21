from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import speech_recognition as sr
from pydub import AudioSegment
import io

qa_pairs = []
questions = []
with open("B:/projects/justlyai/data.json", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        print(f"Parsing line: {repr(line)}")
        item = json.loads(line)
        user_msg = item["user"].strip()
        assistant_msg = item["assistant"].strip()
        qa_pairs.append((user_msg, assistant_msg))
        questions.append(user_msg)

embedder = SentenceTransformer('all-MiniLM-L6-v2')  

question_embeddings = embedder.encode(questions, convert_to_numpy=True)

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    query = data.get('prompt', '').strip()
    query_embedding = embedder.encode([query], convert_to_numpy=True)
    similarities = cosine_similarity(query_embedding, question_embeddings)[0]
    best_idx = int(np.argmax(similarities))
    best_score = similarities[best_idx]
    if best_score > 0.6:  
        return jsonify({'response': qa_pairs[best_idx][1]})
    else:
        return jsonify({'response': "Sorry, I don't have an answer for that question."})

@app.route('/stt', methods=['POST'])
def stt():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    audio_file = request.files['audio']
    audio_bytes = audio_file.read()

    audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format="wav")
    raw_audio = io.BytesIO()
    audio.export(raw_audio, format="wav")
    raw_audio.seek(0)
    recognizer = sr.Recognizer()
    with sr.AudioFile(raw_audio) as source:
        audio_data = recognizer.record(source)
        try:
            transcript = recognizer.recognize_google(audio_data)
            return jsonify({'transcript': transcript})
        except sr.UnknownValueError:
            return jsonify({'error': 'Could not understand audio.'})
        except Exception as e:
            return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5000) 