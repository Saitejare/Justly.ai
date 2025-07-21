package com.justlyai.android.ui

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import com.justlyai.android.databinding.ActivityVoiceBinding
import com.justlyai.android.viewmodel.VoiceViewModel
import java.util.*

class VoiceActivity : AppCompatActivity(), TextToSpeech.OnInitListener {
    
    private lateinit var binding: ActivityVoiceBinding
    private lateinit var viewModel: VoiceViewModel
    private lateinit var speechRecognizer: SpeechRecognizer
    private lateinit var textToSpeech: TextToSpeech
    private var isListening = false
    
    companion object {
        private const val PERMISSION_REQUEST_CODE = 456
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVoiceBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        setupViewModel()
        setupSpeechRecognition()
        setupTextToSpeech()
        checkPermissions()
    }
    
    private fun setupUI() {
        // Set up toolbar
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Voice Assistant"
        
        // Voice button click
        binding.btnVoice.setOnClickListener {
            if (isListening) {
                stopListening()
            } else {
                startListening()
            }
        }
        
        // Quick voice commands
        binding.btnFundamentalRights.setOnClickListener {
            speakAndProcess("What are my fundamental rights?")
        }
        
        binding.btnLaborLaws.setOnClickListener {
            speakAndProcess("Tell me about labor laws")
        }
        
        binding.btnConsumerRights.setOnClickListener {
            speakAndProcess("What are my consumer rights?")
        }
        
        binding.btnEmergency.setOnClickListener {
            speakAndProcess("Show me emergency contacts")
        }
        
        binding.btnHelp.setOnClickListener {
            speakAndProcess("Voice help")
        }
    }
    
    private fun setupViewModel() {
        viewModel = ViewModelProvider(this)[VoiceViewModel::class.java]
        
        viewModel.response.observe(this) { response ->
            response?.let {
                binding.tvResponse.text = it
                speakText(it)
            }
        }
        
        viewModel.isProcessing.observe(this) { isProcessing ->
            binding.progressBar.visibility = if (isProcessing) View.VISIBLE else View.GONE
        }
        
        viewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_LONG).show()
            }
        }
    }
    
    private fun setupSpeechRecognition() {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this)
        speechRecognizer.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                binding.tvStatus.text = "Listening..."
                binding.btnVoice.setImageResource(R.drawable.ic_mic_off)
                isListening = true
            }
            
            override fun onBeginningOfSpeech() {
                binding.tvStatus.text = "Speech detected..."
            }
            
            override fun onRmsChanged(rmsdB: Float) {
                // Update voice level indicator if needed
            }
            
            override fun onBufferReceived(buffer: ByteArray?) {}
            
            override fun onEndOfSpeech() {
                binding.tvStatus.text = "Processing..."
                binding.btnVoice.setImageResource(R.drawable.ic_mic)
                isListening = false
            }
            
            override fun onError(error: Int) {
                binding.tvStatus.text = "Error occurred"
                binding.btnVoice.setImageResource(R.drawable.ic_mic)
                isListening = false
                
                when (error) {
                    SpeechRecognizer.ERROR_NO_MATCH -> {
                        Toast.makeText(this@VoiceActivity, "No speech detected", Toast.LENGTH_SHORT).show()
                    }
                    SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> {
                        Toast.makeText(this@VoiceActivity, "Speech timeout", Toast.LENGTH_SHORT).show()
                    }
                    else -> {
                        Toast.makeText(this@VoiceActivity, "Speech recognition error", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            
            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (!matches.isNullOrEmpty()) {
                    val spokenText = matches[0]
                    binding.tvUserInput.text = spokenText
                    processVoiceCommand(spokenText)
                }
            }
            
            override fun onPartialResults(partialResults: Bundle?) {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
    }
    
    private fun setupTextToSpeech() {
        textToSpeech = TextToSpeech(this, this)
    }
    
    private fun checkPermissions() {
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECORD_AUDIO),
                PERMISSION_REQUEST_CODE
            )
        }
    }
    
    private fun startListening() {
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak your legal question...")
            }
            speechRecognizer.startListening(intent)
        } else {
            Toast.makeText(this, "Microphone permission required", Toast.LENGTH_LONG).show()
        }
    }
    
    private fun stopListening() {
        speechRecognizer.stopListening()
        binding.tvStatus.text = "Ready"
        binding.btnVoice.setImageResource(R.drawable.ic_mic)
        isListening = false
    }
    
    private fun processVoiceCommand(command: String) {
        viewModel.processVoiceCommand(command)
    }
    
    private fun speakAndProcess(text: String) {
        binding.tvUserInput.text = text
        processVoiceCommand(text)
    }
    
    private fun speakText(text: String) {
        if (::textToSpeech.isInitialized) {
            textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
        }
    }
    
    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = textToSpeech.setLanguage(Locale.getDefault())
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Toast.makeText(this, "Language not supported", Toast.LENGTH_SHORT).show()
            }
        } else {
            Toast.makeText(this, "Text-to-speech initialization failed", Toast.LENGTH_SHORT).show()
        }
    }
    
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
    
    override fun onDestroy() {
        super.onDestroy()
        if (::speechRecognizer.isInitialized) {
            speechRecognizer.destroy()
        }
        if (::textToSpeech.isInitialized) {
            textToSpeech.stop()
            textToSpeech.shutdown()
        }
    }
} 