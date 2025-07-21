import React, { useState, KeyboardEvent, useRef } from 'react';
import './InputBox.css';

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = async () => {
    if (recording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setRecording(false);
    } else {
      // Start recording
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Your browser does not support audio recording.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunks.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');
          try {
            const res = await fetch('http://localhost:5000/stt', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            if (data.transcript) {
              onSend(data.transcript);
            } else {
              alert(data.error || 'Could not recognize speech.');
            }
          } catch (err) {
            alert('Error sending audio to server.');
          }
        };
        mediaRecorder.start();
        setRecording(true);
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setRecording(false);
          }
        }, 10000); // 10 seconds max
      } catch (err) {
        alert('Could not access microphone.');
      }
    }
  };

  return (
    <div className="input-container">
      <div className="input-wrapper">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={disabled}
          rows={1}
          className="message-input"
        />
        <button
          type="button"
          className={`mic-button${recording ? ' recording' : ''}`}
          onClick={handleMicClick}
          disabled={disabled}
          title={recording ? 'Stop Recording' : 'Start Voice Input'}
        >
          {recording ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#e74c3c" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v6a4 4 0 0 0 4 4zm5-4a1 1 0 1 1 2 0 6 6 0 0 1-6 6v2h-2v-2a6 6 0 0 1-6-6 1 1 0 1 1 2 0 4 4 0 0 0 8 0z" fill="currentColor"/>
            </svg>
          )}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className="send-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputBox; 