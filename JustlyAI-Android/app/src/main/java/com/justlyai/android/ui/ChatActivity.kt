package com.justlyai.android.ui

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.justlyai.android.R
import com.justlyai.android.adapter.ChatAdapter
import com.justlyai.android.databinding.ActivityChatBinding
import com.justlyai.android.model.ChatMessage
import com.justlyai.android.viewmodel.ChatViewModel

class ChatActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityChatBinding
    private lateinit var viewModel: ChatViewModel
    private lateinit var chatAdapter: ChatAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        setupViewModel()
        setupRecyclerView()
    }
    
    private fun setupUI() {
        // Set up toolbar
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Chat with JustlyAI"
        
        // Send button click
        binding.btnSend.setOnClickListener {
            val message = binding.etMessage.text.toString().trim()
            if (message.isNotEmpty()) {
                sendMessage(message)
                binding.etMessage.text.clear()
            }
        }
        
        // Voice button click
        binding.btnVoice.setOnClickListener {
            // Navigate to voice activity or start voice input
            Toast.makeText(this, "Voice input coming soon", Toast.LENGTH_SHORT).show()
        }
        
        // Quick action buttons
        binding.btnFundamentalRights.setOnClickListener {
            sendMessage("What are my fundamental rights?")
        }
        
        binding.btnLaborLaws.setOnClickListener {
            sendMessage("Tell me about labor laws")
        }
        
        binding.btnConsumerRights.setOnClickListener {
            sendMessage("What are my consumer rights?")
        }
        
        binding.btnEmergency.setOnClickListener {
            sendMessage("Show me emergency contacts")
        }
    }
    
    private fun setupViewModel() {
        viewModel = ViewModelProvider(this)[ChatViewModel::class.java]
        
        viewModel.chatMessages.observe(this) { messages ->
            chatAdapter.submitList(messages)
            binding.recyclerView.scrollToPosition(messages.size - 1)
        }
        
        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
        
        viewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_LONG).show()
            }
        }
    }
    
    private fun setupRecyclerView() {
        chatAdapter = ChatAdapter()
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@ChatActivity)
            adapter = chatAdapter
        }
        
        // Add welcome message
        viewModel.addMessage(ChatMessage(
            text = "Hello! I'm JustlyAI, your free legal assistant. How can I help you today?",
            isFromUser = false,
            timestamp = System.currentTimeMillis()
        ))
    }
    
    private fun sendMessage(message: String) {
        viewModel.addMessage(ChatMessage(
            text = message,
            isFromUser = true,
            timestamp = System.currentTimeMillis()
        ))
        
        viewModel.sendMessage(message)
    }
    
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
} 