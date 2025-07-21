#!/usr/bin/env python3
"""
Test script to verify API connection for Android app
"""

import requests
import json
import sys

def test_api_connection():
    """Test if the Flask backend is accessible"""
    
    base_url = "http://localhost:5000"
    
    print("🔍 Testing JustlyAI API Connection for Android App")
    print("=" * 50)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running and accessible")
        else:
            print(f"❌ Server responded with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to server: {e}")
        print("💡 Make sure to run: python app.py in mini-chatbot folder")
        return False
    
    # Test 2: Test chat API endpoint
    try:
        chat_data = {
            "message": "What are my rights if I'm arrested?",
            "language": "english"
        }
        response = requests.post(f"{base_url}/api/chat", 
                               json=chat_data, 
                               timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            if 'response' in result:
                print("✅ Chat API endpoint working")
                print(f"📝 Response preview: {result['response'][:100]}...")
            else:
                print("❌ Chat API response format incorrect")
                return False
        else:
            print(f"❌ Chat API failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Chat API request failed: {e}")
        return False
    
    # Test 3: Test legal topics API
    try:
        response = requests.get(f"{base_url}/api/legal-topics", timeout=5)
        
        if response.status_code == 200:
            topics = response.json()
            if isinstance(topics, dict) and len(topics) > 0:
                print("✅ Legal topics API working")
                print(f"📋 Available topics: {len(topics)}")
            else:
                print("❌ Legal topics API response format incorrect")
                return False
        else:
            print(f"❌ Legal topics API failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Legal topics API request failed: {e}")
        return False
    
    # Test 4: Test emergency contacts API
    try:
        response = requests.get(f"{base_url}/api/emergency-contacts", timeout=5)
        
        if response.status_code == 200:
            contacts = response.json()
            if isinstance(contacts, dict) and len(contacts) > 0:
                print("✅ Emergency contacts API working")
                print(f"🚨 Available contacts: {len(contacts)}")
            else:
                print("❌ Emergency contacts API response format incorrect")
                return False
        else:
            print(f"❌ Emergency contacts API failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Emergency contacts API request failed: {e}")
        return False
    
    # Test 5: Test case sections API
    try:
        response = requests.get(f"{base_url}/api/case-sections", timeout=5)
        
        if response.status_code == 200:
            sections = response.json()
            if isinstance(sections, dict) and len(sections) > 0:
                print("✅ Case sections API working")
                print(f"📋 Available sections: {len(sections)}")
            else:
                print("❌ Case sections API response format incorrect")
                return False
        else:
            print(f"❌ Case sections API failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Case sections API request failed: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 All API tests passed! Android app should work correctly.")
    print("\n📱 Android App Configuration:")
    print(f"   • Emulator URL: http://10.0.2.2:5000/")
    print(f"   • Physical Device: http://YOUR_COMPUTER_IP:5000/")
    print("\n🚀 Ready to run in Android Studio!")
    
    return True

def get_computer_ip():
    """Get the computer's IP address for physical device testing"""
    try:
        import socket
        hostname = socket.gethostname()
        ip_address = socket.gethostbyname(hostname)
        print(f"\n💡 For physical device testing, use IP: {ip_address}")
        print(f"   Update JustlyAIApi.kt: BASE_URL = \"http://{ip_address}:5000/\"")
    except Exception as e:
        print(f"Could not determine IP address: {e}")

if __name__ == "__main__":
    success = test_api_connection()
    get_computer_ip()
    
    if not success:
        print("\n❌ API tests failed. Please check the backend server.")
        sys.exit(1) 