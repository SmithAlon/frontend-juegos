#!/bin/bash

# Iniciar el backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py &

# Esperar un momento para que el backend inicie
sleep 2

# Iniciar el frontend
cd ..
npm run dev 