package com.justlyai.android.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface JustlyAIApi {
    
    @POST("api/chat")
    suspend fun sendMessage(@Body request: ChatRequest): ChatResponse
    
    companion object {
        // For Android emulator: http://10.0.2.2:5000/
        // For physical device: http://<your-computer-ip>:5000/
        private const val BASE_URL = "http://10.0.2.2:5000/"
        
        fun create(): JustlyAIApi {
            return retrofit2.Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(retrofit2.converter.gson.GsonConverterFactory.create())
                .build()
                .create(JustlyAIApi::class.java)
        }
    }
}

data class ChatRequest(
    val message: String,
    val language: String = "english",
    val is_voice: Boolean = false
)

data class ChatResponse(
    val response: String,
    val timestamp: String? = null,
    val error: String? = null
) 