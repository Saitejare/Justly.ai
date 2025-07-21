#!/bin/bash

echo "========================================"
echo "    JustlyAI Backend Launcher"
echo "========================================"
echo ""
echo "Starting Flask backend for Android app..."
echo ""

cd ../mini-chatbot

echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Starting Flask server..."
echo "Backend will be available at: http://localhost:5000"
echo "For Android emulator: http://10.0.2.2:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py 