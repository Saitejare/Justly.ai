package com.justlyai.android.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "chat_messages")
data class ChatMessage(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val text: String,
    val isFromUser: Boolean,
    val timestamp: Long,
    val messageType: MessageType = MessageType.TEXT
)

enum class MessageType {
    TEXT,
    VOICE,
    QUICK_ACTION
} 