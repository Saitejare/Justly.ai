package com.justlyai.android.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.justlyai.android.repository.JustlyAIRepository
import kotlinx.coroutines.launch

class VoiceViewModel : ViewModel() {
    
    private val repository = JustlyAIRepository()
    
    private val _response = MutableLiveData<String?>()
    val response: LiveData<String?> = _response
    
    private val _isProcessing = MutableLiveData<Boolean>()
    val isProcessing: LiveData<Boolean> = _isProcessing
    
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    fun processVoiceCommand(command: String) {
        viewModelScope.launch {
            try {
                _isProcessing.value = true
                _error.value = null
                
                val response = repository.sendMessage(command)
                _response.value = response
                
            } catch (e: Exception) {
                _error.value = "Error: ${e.message}"
                _response.value = "I'm sorry, I couldn't process your voice command. Please try again."
            } finally {
                _isProcessing.value = false
            }
        }
    }
    
    fun clearResponse() {
        _response.value = null
    }
} 