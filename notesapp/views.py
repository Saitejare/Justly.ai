from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from bson.objectid import ObjectId
from datetime import datetime
import json
from django.contrib.auth.hashers import make_password, check_password

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client['personal_notes_db']
users_collection = db['users']
notes_collection = db['notes']

def get_logged_in_user(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return None
    return users_collection.find_one({'_id': ObjectId(user_id)})

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        if not username or not password:
            return render(request, 'notesapp/register.html', {'error': 'Username and password required.'})
        if users_collection.find_one({'username': username}):
            return render(request, 'notesapp/register.html', {'error': 'Username already exists.'})
        user = {
            'username': username,
            'password_hash': make_password(password),
            'created_at': datetime.now()
        }
        result = users_collection.insert_one(user)
        return redirect('login')
    return render(request, 'notesapp/register.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        user = users_collection.find_one({'username': username})
        if not user or not check_password(password, user['password_hash']):
            return render(request, 'notesapp/login.html', {'error': 'Invalid username or password.'})
        request.session['user_id'] = str(user['_id'])
        return redirect('dashboard')
    return render(request, 'notesapp/login.html')

def logout_view(request):
    request.session.flush()
    return redirect('login')

def dashboard(request):
    user = get_logged_in_user(request)
    if not user:
        return redirect('login')
    note_count = notes_collection.count_documents({'user_id': user['_id']})
    return render(request, 'notesapp/dashboard.html', {'username': user['username'], 'note_count': note_count})

def my_notes(request):
    user = get_logged_in_user(request)
    if not user:
        return redirect('login')
    notes = []
    for note in notes_collection.find({'user_id': user['_id']}).sort('created_at', -1):
        note['id'] = str(note['_id'])  # Use 'id' for template
        note['created_at'] = note['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        notes.append(note)
    return render(request, 'notesapp/mynotes.html', {'username': user['username'], 'notes': notes})

@csrf_exempt
def notes_api(request):
    user = get_logged_in_user(request)
    print(f"[DEBUG] notes_api called, method={request.method}, user={user}")
    if not user:
        print("[DEBUG] Not authenticated")
        return JsonResponse({'error': 'Not authenticated.'}, status=401)
    if request.method == 'GET':
        notes = []
        for note in notes_collection.find({'user_id': user['_id']}).sort('created_at', -1):
            note['_id'] = str(note['_id'])
            note['created_at'] = note['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            notes.append(note)
        return JsonResponse({'notes': notes})
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title', '').strip()
            content = data.get('content', '').strip()
            print(f"[DEBUG] Add note: title={title}, content={content}")
            if not title:
                print("[DEBUG] Title is required")
                return JsonResponse({'error': 'Title is required.'}, status=400)
            note = {
                'title': title,
                'content': content,
                'created_at': datetime.now(),
                'user_id': user['_id']
            }
            result = notes_collection.insert_one(note)
            print(f"[DEBUG] Note inserted with id: {result.inserted_id}")
            note['_id'] = str(result.inserted_id)
            note['created_at'] = note['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            note['user_id'] = str(note['user_id'])  # Ensure user_id is serializable
            return JsonResponse(note)
        except Exception as e:
            print(f"[ERROR] Failed to add note: {e}")
            return JsonResponse({'error': 'Failed to add note.'}, status=500)
    elif request.method == 'PUT':
        data = json.loads(request.body)
        note_id = data.get('id')
        title = data.get('title', '').strip()
        content = data.get('content', '').strip()
        result = notes_collection.update_one(
            {'_id': ObjectId(note_id), 'user_id': user['_id']},
            {'$set': {'title': title, 'content': content}}
        )
        if result.matched_count == 0:
            return JsonResponse({'error': 'Note not found.'}, status=404)
        return JsonResponse({'success': True})
    elif request.method == 'DELETE':
        data = json.loads(request.body)
        note_id = data.get('id')
        result = notes_collection.delete_one({'_id': ObjectId(note_id), 'user_id': user['_id']})
        if result.deleted_count == 0:
            return JsonResponse({'error': 'Note not found.'}, status=404)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request.'}, status=400) 