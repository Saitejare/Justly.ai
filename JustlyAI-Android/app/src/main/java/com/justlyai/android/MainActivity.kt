package com.justlyai.android

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.justlyai.android.databinding.ActivityMainBinding
import com.justlyai.android.ui.ChatActivity
import com.justlyai.android.ui.VoiceActivity
import com.justlyai.android.ui.LegalTopicsActivity
import com.justlyai.android.ui.EmergencyContactsActivity

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private val PERMISSION_REQUEST_CODE = 123
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        checkPermissions()
    }
    
    private fun setupUI() {
        // Chat with JustlyAI
        binding.btnChat.setOnClickListener {
            startActivity(Intent(this, ChatActivity::class.java))
        }
        
        // Voice Assistant
        binding.btnVoice.setOnClickListener {
            if (checkAudioPermission()) {
                startActivity(Intent(this, VoiceActivity::class.java))
            } else {
                requestAudioPermission()
            }
        }
        
        // Legal Topics
        binding.btnLegalTopics.setOnClickListener {
            startActivity(Intent(this, LegalTopicsActivity::class.java))
        }
        
        // Emergency Contacts
        binding.btnEmergency.setOnClickListener {
            startActivity(Intent(this, EmergencyContactsActivity::class.java))
        }
        
        // Quick Legal Tips
        binding.btnQuickTips.setOnClickListener {
            showQuickLegalTips()
        }
    }
    
    private fun checkPermissions() {
        if (!checkAudioPermission()) {
            requestAudioPermission()
        }
    }
    
    private fun checkAudioPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
    }
    
    private fun requestAudioPermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.RECORD_AUDIO),
            PERMISSION_REQUEST_CODE
        )
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        
        when (requestCode) {
            PERMISSION_REQUEST_CODE -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(this, "Audio permission granted", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "Audio permission required for voice features", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
    
    private fun showQuickLegalTips() {
        val tips = """
            🚨 Quick Legal Tips:
            
            📋 Fundamental Rights:
            • Right to Equality (Article 14-18)
            • Right to Freedom (Article 19-22)
            • Right against Exploitation (Article 23-24)
            • Right to Freedom of Religion (Article 25-28)
            • Right to Education (Article 21A)
            
            💼 Labor Rights:
            • Minimum wage varies by state
            • 8-hour workday maximum
            • Overtime pay for extra hours
            • Paid leave and holidays
            • Safe working conditions
            
            🛒 Consumer Rights:
            • Right to safety
            • Right to information
            • Right to choose
            • Right to be heard
            • Right to redressal
            
            🚨 Emergency Contacts:
            • Police: 100
            • Women Helpline: 1091
            • Child Helpline: 1098
            • Legal Aid: 1800-11-0001
        """.trimIndent()
        
        // Show in a dialog or navigate to tips activity
        Toast.makeText(this, "Quick tips available in the app", Toast.LENGTH_SHORT).show()
    }
} 