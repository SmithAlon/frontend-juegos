from flask import Flask, request, jsonify
from flask_cors import CORS
from syllable_highlighter import highlight_text

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No se proporcionó texto'}), 400
    
    try:
        # Procesar el texto solo con negrita
        processed_text = highlight_text(text, 'bold')
        # Convertir los códigos ANSI a HTML
        processed_text = processed_text.replace('\033[1m', '<strong>').replace('\033[0m', '</strong>')
        
        return jsonify({'text': processed_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 