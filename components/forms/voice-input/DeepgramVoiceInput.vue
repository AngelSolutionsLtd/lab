<template>
  <div class="voice-input">
    <label v-if="labelTitle" :for="id" class="voice-input__label">{{ labelTitle }}</label>

    <div class="voice-input__textarea-container">
      <textarea
        :id="id"
        v-model="currentValue"
        :placeholder="placeholder"
        :disabled="disabled || isConnecting"
        :maxlength="maxLength"
        class="voice-input__textarea"
        :class="{ 'voice-input__textarea--listening': isListening }"
        rows="5"
        @focus="cursorPosition = $event.target.selectionStart"
        @blur="$emit('blur')"
      />

      <div v-if="isConnecting" class="voice-input__listening-overlay">
        <span class="entypo--mic voice-input__listening-spinner" />
        <span class="voice-input__listening-text">Connecting…</span>
      </div>

      <div v-else-if="isListening" class="voice-input__listening-overlay">
        <span class="entypo--mic voice-input__listening-spinner" />
        <span class="voice-input__listening-text">Listening…</span>
      </div>

      <button
        type="button"
        :disabled="disabled || isConnecting"
        class="voice-input__mic-btn"
        :class="{ 'voice-input__mic-btn--listening': isListening }"
        :aria-pressed="isListening"
        :aria-label="isListening ? 'Stop listening' : 'Start dictating'"
        @click="toggleListening"
        @keydown.enter.space.prevent="toggleListening"
      >
        <span v-if="!isListening" class="entypo--mic voice-input__mic-icon" />
        <span v-else class="entypo--stop voice-input__stop-icon" />
      </button>
    </div>

    <transition name="status-fade">
      <div v-if="errorMessage" aria-live="polite" class="voice-input__status">
        <span class="voice-input__status-text voice-input__status-text--error">{{ errorMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { DeepgramClient } from '@deepgram/sdk';

export default {
  name: 'DeepgramVoiceInput',
  props: {
    id: { type: String, required: true },
    modelValue: { type: String, default: '' },
    labelTitle: { type: String, default: '' },
    placeholder: { type: String, default: 'Type or dictate…' },
    disabled: { type: Boolean, default: false },
    maxLength: { type: Number, default: null },
    language: { type: String, default: 'en-US' },
    tempKeyEndpoint: { type: String, default: '/api/deepgram/temp-key' },
    deepgramApiKey: { type: String, default: '' },
    silenceTimeout: { type: Number, default: 10 },
  },
  emits: ['update:modelValue', 'transcription-start', 'transcription-end', 'error', 'blur'],
  data() {
    return {
      currentValue: this.modelValue,
      isListening: false,
      isConnecting: false,
      errorMessage: '',
      mediaStream: null,
      processor: null,
      liveConnection: null,
      audioContext: null,
      silenceInterval: null,
      lastSoundAt: 0,
      baseValue: '',
      cursorPosition: 0,
    };
  },
  watch: {
    modelValue(newVal) {
      this.currentValue = newVal;
    },
  },
  mounted() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.stopListening();
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }
  },
  methods: {
    async toggleListening() {
      if (this.isListening) {
        this.stopListening();
      } else {
        await this.startListening();
      }
    },
    async startListening() {
      try {
        this.isConnecting = true;
        this.errorMessage = '';
        this.baseValue = this.currentValue;

        const apiKey = await this.fetchToken();
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        await this.connectDeepgram(apiKey);

        this.isListening = true;
        this.isConnecting = false;
        this.$emit('transcription-start');

        this.startSilenceDetection();

        const mediaRecorder = new MediaRecorder(this.mediaStream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.liveConnection?.sendMedia(event.data);
          }
        };
        mediaRecorder.start(100);
        this.processor = mediaRecorder;
      } catch (error) {
        this.handleError(error);
        this.isConnecting = false;
      }
    },
    stopListening() {
      this.isListening = false;
      this.clearSilenceDetection();
      if (this.processor instanceof MediaRecorder && this.processor.state !== 'inactive') {
        this.processor.stop();
      }
      this.mediaStream?.getTracks().forEach((track) => track.stop());
      this.liveConnection?.close();
      this.liveConnection = null;
      this.$emit('transcription-end');
    },
    handleVisibilityChange() {
      if (document.hidden && this.isListening) {
        this.stopListening();
      }
    },
    startSilenceDetection() {
      if (!this.silenceTimeout) return;
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buffer = new Float32Array(analyser.fftSize);
      this.lastSoundAt = Date.now();
      this.silenceInterval = setInterval(() => {
        analyser.getFloatTimeDomainData(buffer);
        const rms = Math.sqrt(buffer.reduce((sum, v) => sum + v * v, 0) / buffer.length);
        if (rms > 0.01) {
          this.lastSoundAt = Date.now();
        } else if (Date.now() - this.lastSoundAt >= this.silenceTimeout * 1000) {
          this.stopListening();
        }
      }, 500);
    },
    clearSilenceDetection() {
      if (this.silenceInterval) {
        clearInterval(this.silenceInterval);
        this.silenceInterval = null;
      }
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
    },
    async fetchToken() {
      if (this.deepgramApiKey) {
        return this.deepgramApiKey;
      }
      const response = await fetch(this.tempKeyEndpoint);
      if (!response.ok) throw new Error('Failed to fetch Deepgram token');
      const data = await response.json();
      return data.token;
    },
    async connectDeepgram(apiKey) {
      const langMap = { 'en-US': 'en', 'en-GB': 'en', 'es-ES': 'es', 'fr-FR': 'fr', 'de-DE': 'de', 'pt-BR': 'pt', 'ja-JP': 'ja' };
      const lang = langMap[this.language] || 'en';

      const deepgram = new DeepgramClient({ apiKey });
      const connection = await deepgram.listen.v1.createConnection({
        model: 'nova-3',
        language: lang,
        punctuate: true,
        interim_results: true,
      });

      return new Promise((resolve, reject) => {
        connection.on('open', () => {
          this.liveConnection = connection;
          resolve();
        });

        connection.on('error', (err) => {
          console.error('[Deepgram] connection error:', err);
          reject(new Error(err?.message || 'Deepgram connection failed'));
        });

        connection.on('message', (data) => {
          if (data.type === 'Results' && data.is_final) {
            const transcript = data.channel?.alternatives?.[0]?.transcript || '';
            if (transcript) {
              const before = this.currentValue.substring(0, this.cursorPosition);
              const after = this.currentValue.substring(this.cursorPosition);
              this.currentValue = before + transcript + after;
              this.cursorPosition += transcript.length;
              this.$emit('update:modelValue', this.currentValue);
              this.baseValue = this.currentValue;
            }
          }
        });

        connection.connect();
      });
    },
    handleError(error) {
      console.error('[DeepgramVoiceInput] error:', error);
      let msg = 'An error occurred';
      if (error.name === 'NotAllowedError') msg = 'Microphone permission denied.';
      else if (error.name === 'NotFoundError') msg = 'No microphone found.';
      else if (error.message) msg = error.message;
      this.errorMessage = msg;
      this.$emit('error', msg);
    },
  },
};
</script>

<style scoped>
.status-fade-enter-active,
.status-fade-leave-active {
  transition: all 0.2s ease;
}

.status-fade-enter-from,
.status-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.voice-input {
  display: flex;
  flex-direction: column;
}

.voice-input__label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
}

.voice-input__textarea-container {
  position: relative;
}

.voice-input__textarea {
  width: 100%;
  padding: 0.75rem 3.25rem 0.75rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  background-color: #fff;
  color: #333;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.voice-input__textarea::placeholder {
  color: #bbb;
}

.voice-input__textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

.voice-input__textarea:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.voice-input__textarea--listening {
  border-color: #a855f7;
}

.voice-input__listening-overlay {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  border: 1px solid rgba(168, 85, 247, 0.5);
  border-radius: 20px;
  padding: 0.2rem 0.65rem;
  pointer-events: none;
  white-space: nowrap;
  width: fit-content;
  animation: pill-pulse 1.5s ease-in-out infinite;
}

.voice-input__listening-spinner {
  font-size: 1rem;
  color: #a855f7;
  flex-shrink: 0;
}

.voice-input__listening-text {
  font-size: 0.75rem;
  color: #a855f7;
  font-weight: 500;
}

.voice-input__mic-btn {
  position: absolute;
  bottom: 0.625rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #999;
  transition: all 0.2s ease;
}

.voice-input__mic-btn:hover:not(:disabled) {
  color: #a855f7;
  background-color: rgba(168, 85, 247, 0.08);
}

.voice-input__mic-btn:active:not(:disabled) {
  transform: scale(0.92);
}

.voice-input__mic-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
}

.voice-input__mic-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.voice-input__mic-btn--listening {
  color: #dc2626;
  background-color: rgba(220, 38, 38, 0.08);
}

.voice-input__mic-btn--listening:hover {
  background-color: rgba(220, 38, 38, 0.12);
}

.voice-input__status {
  font-size: 0.8125rem;
  margin-top: 0.375rem;
}

.voice-input__status-text {
  color: #999;
}

.voice-input__status-text--connecting {
  color: #a855f7;
  font-weight: 500;
}

.voice-input__status-text--error {
  color: #dc2626;
  font-weight: 500;
}

@keyframes pill-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.35); }
  50% { box-shadow: 0 0 0 5px rgba(168, 85, 247, 0); }
}
</style>
