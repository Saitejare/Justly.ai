package com.justlyai.android.repository

import com.justlyai.android.api.JustlyAIApi
import com.justlyai.android.api.ChatRequest
import com.justlyai.android.api.ChatResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class JustlyAIRepository {
    
    private val api = JustlyAIApi.create()
    
    suspend fun sendMessage(message: String): String {
        return withContext(Dispatchers.IO) {
            try {
                val request = ChatRequest(message = message, is_voice = false)
                val response = api.sendMessage(request)
                response.response
            } catch (e: Exception) {
                // Fallback to local processing if API is not available
                processLocalMessage(message)
            }
        }
    }
    
    suspend fun sendVoiceMessage(message: String): String {
        return withContext(Dispatchers.IO) {
            try {
                val request = ChatRequest(message = message, is_voice = true)
                val response = api.sendMessage(request)
                response.response
            } catch (e: Exception) {
                // Fallback to local processing if API is not available
                processLocalVoiceCommand(message)
            }
        }
    }
    
    private fun processLocalMessage(message: String): String {
        // Local processing logic for when API is not available
        return when {
            message.contains("fundamental rights", ignoreCase = true) -> {
                "Here's information about fundamental rights:\n\n" +
                "1. Right to Equality (Article 14-18)\n" +
                "2. Right to Freedom (Article 19-22)\n" +
                "3. Right against Exploitation (Article 23-24)\n" +
                "4. Right to Freedom of Religion (Article 25-28)\n" +
                "5. Right to Education (Article 21A)"
            }
            message.contains("labor laws", ignoreCase = true) -> {
                "Labor Laws in India:\n\n" +
                "• Minimum wage varies by state\n" +
                "• 8-hour workday maximum\n" +
                "• Overtime pay for extra hours\n" +
                "• Paid leave and holidays\n" +
                "• Safe working conditions"
            }
            message.contains("consumer rights", ignoreCase = true) -> {
                "Consumer Rights:\n\n" +
                "• Right to safety\n" +
                "• Right to information\n" +
                "• Right to choose\n" +
                "• Right to be heard\n" +
                "• Right to redressal"
            }
            message.contains("emergency", ignoreCase = true) -> {
                "Emergency Contacts:\n\n" +
                "• Police: 100\n" +
                "• Women Helpline: 1091\n" +
                "• Child Helpline: 1098\n" +
                "• Legal Aid: 1800-11-0001"
            }
            else -> {
                "I'm JustlyAI, your free legal assistant. I can help you with:\n" +
                "• Fundamental rights\n" +
                "• Labor laws\n" +
                "• Consumer rights\n" +
                "• Emergency contacts\n" +
                "Please ask me a specific legal question."
            }
        }
    }
    
    private fun processLocalVoiceCommand(command: String): String {
        return when {
            command.contains("repeat", ignoreCase = true) -> {
                "I can repeat my last response. What would you like me to repeat?"
            }
            command.contains("summarize", ignoreCase = true) -> {
                "I can help you with legal information. What would you like to know?"
            }
            command.contains("clear", ignoreCase = true) -> {
                "Chat history cleared. Starting fresh conversation."
            }
            command.contains("help", ignoreCase = true) -> {
                "Voice Commands:\n" +
                "• Ask legal questions\n" +
                "• Say 'repeat' to repeat\n" +
                "• Say 'summarize' for summary\n" +
                "• Say 'clear' to clear chat"
            }
            else -> {
                processLocalMessage(command)
            }
        }
    }
} 