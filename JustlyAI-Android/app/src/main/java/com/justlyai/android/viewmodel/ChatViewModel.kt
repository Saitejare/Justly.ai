package com.justlyai.android.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.justlyai.android.model.ChatMessage
import com.justlyai.android.repository.JustlyAIRepository
import kotlinx.coroutines.launch

class ChatViewModel : ViewModel() {
    
    private val repository = JustlyAIRepository()
    
    private val _chatMessages = MutableLiveData<List<ChatMessage>>()
    val chatMessages: LiveData<List<ChatMessage>> = _chatMessages
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading
    
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    private val messages = mutableListOf<ChatMessage>()
    
    init {
        _chatMessages.value = messages
    }
    
    fun addMessage(message: ChatMessage) {
        messages.add(message)
        _chatMessages.value = messages.toList()
    }
    
    fun sendMessage(message: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null
                
                val response = repository.sendMessage(message)
                
                addMessage(ChatMessage(
                    text = response,
                    isFromUser = false,
                    timestamp = System.currentTimeMillis()
                ))
                
            } catch (e: Exception) {
                _error.value = "Error: ${e.message}"
                
                // Add fallback response
                addMessage(ChatMessage(
                    text = "I'm sorry, I couldn't process your request. Please try again or check your internet connection.",
                    isFromUser = false,
                    timestamp = System.currentTimeMillis()
                ))
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun clearChat() {
        messages.clear()
        _chatMessages.value = messages.toList()
    }
} 