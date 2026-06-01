<template>
  <div class="voice-input">
    <label v-if="labelTitle" :for="id" class="voice-input__label">{{ labelTitle }}</label>

    <!-- Main textarea wrapper with embedded mic button -->
    <div class="voice-input__textarea-container">
      <!-- Actual textarea -->
      <textarea
        :id="id"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        class="voice-input__textarea"
        :class="{
          'voice-input__textarea--listening': isListening,
        }"
        rows="5"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Listening overlay -->
      <div v-if="isListening" class="voice-input__listening-overlay">
        <span class="entypo--mic voice-input__listening-spinner" />
        <span class="voice-input__listening-text">Listening…</span>
      </div>

      <!-- Embedded mic button (bottom-right corner) -->
      <button
        v-if="isSupported"
        type="button"
        :disabled="disabled"
        class="voice-input__mic-btn"
        :class="{
          'voice-input__mic-btn--listening': isListening,
        }"
        :aria-pressed="isListening"
        :aria-label="isListening ? 'Stop listening' : 'Start dictating'"
        title="Press to dictate"
        @click="toggleListening"
        @keydown.enter.space.prevent="toggleListening"
      >
        <!-- Mic icon (when not listening) -->
        <span v-if="!isListening" class="entypo--mic voice-input__mic-icon" />
        <!-- Stop icon (when listening) -->
        <span v-else class="entypo--stop voice-input__stop-icon" />
      </button>
    </div>

    <!-- Error message (below textarea) -->
    <transition name="status-fade">
      <div v-if="errorMessage" class="voice-input__status">
        <span class="voice-input__status-text voice-input__status-text--error">
          {{ errorMessage }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'VoiceInput',
  props: {
    id: {
      type: String,
      required: true,
    },
    labelTitle: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Type or dictate…',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: null,
    },
    language: {
      type: String,
      default: 'en-US',
    },
    silenceTimeout: {
      type: Number,
      default: 10,
    },
  },
  emits: ['input', 'focus', 'blur'],
  data() {
    return {
      isSupported: false,
      isListening: false,
      interimText: '',
      recognition: null,
      errorMessage: '',
      hasUserStoppedRecognition: false,
      baseValue: '',
      silenceTimer: null,
      lastResultAt: 0,
    };
  },
  mounted() {
    this.initSpeechRecognition();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.clearSilenceTimer();
    if (this.recognition) {
      this.recognition.abort();
      this.recognition = null;
    }
  },
  methods: {
    initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        this.isSupported = false;
        return;
      }

      this.isSupported = true;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.errorMessage = '';
        this.hasUserStoppedRecognition = false;
        this.baseValue = this.value;
        this.startSilenceTimer();
      };

      this.recognition.onresult = (event) => {
        this.lastResultAt = Date.now();
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        const newValue = this.baseValue + final + interim;
        this.emitInput(newValue);
        this.interimText = interim;
      };

      this.recognition.onerror = (event) => {
        switch (event.error) {
          case 'no-speech':
            this.errorMessage = 'No speech detected.';
            break;
          case 'audio-capture':
            this.errorMessage = 'No microphone found.';
            break;
          case 'not-allowed':
            this.errorMessage = 'Microphone permission denied.';
            break;
          case 'network':
            this.errorMessage = 'Network error.';
            break;
          default:
            this.errorMessage = `Error: ${event.error}`;
        }
      };

      this.recognition.onend = () => {
        if (!this.hasUserStoppedRecognition && this.isListening) {
          this.recognition.start();
        } else {
          this.isListening = false;
          this.interimText = '';
          this.clearSilenceTimer();
        }
      };
    },
    toggleListening() {
      if (!this.recognition) return;

      if (this.isListening) {
        this.hasUserStoppedRecognition = true;
        this.recognition.stop();
        this.isListening = false;
        this.interimText = '';
        this.clearSilenceTimer();
      } else {
        this.hasUserStoppedRecognition = false;
        this.recognition.start();
      }
    },
    handleVisibilityChange() {
      if (document.hidden && this.isListening) {
        this.hasUserStoppedRecognition = true;
        this.recognition.stop();
        this.isListening = false;
        this.interimText = '';
        this.clearSilenceTimer();
      }
    },
    startSilenceTimer() {
      this.clearSilenceTimer();
      if (!this.silenceTimeout) return;
      this.lastResultAt = Date.now();
      this.silenceTimer = setInterval(() => {
        if (Date.now() - this.lastResultAt >= this.silenceTimeout * 1000) {
          this.hasUserStoppedRecognition = true;
          this.recognition.stop();
          this.isListening = false;
          this.interimText = '';
          this.clearSilenceTimer();
        }
      }, 1000);
    },
    clearSilenceTimer() {
      if (this.silenceTimer) {
        clearInterval(this.silenceTimer);
        this.silenceTimer = null;
      }
    },
    handleInput(event) {
      this.emitInput(event.target.value);
    },
    emitInput(newValue) {
      this.$emit('input', newValue);
    },
    handleFocus() {
      this.$emit('focus');
    },
    handleBlur() {
      this.$emit('blur');
    },
  },
};
</script>

<style scoped>
/* Transitions */
.interim-fade-enter-active,
.interim-fade-leave-active,
.status-fade-enter-active,
.status-fade-leave-active {
  transition: all 0.2s ease;
}

.interim-fade-enter-from,
.interim-fade-leave-to,
.status-fade-enter-from,
.status-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}


/* Main container */
.voice-input {
  display: flex;
  flex-direction: column;
}

.voice-input__label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
}

/* Textarea container */
.voice-input__textarea-container {
  position: relative;
}

/* Textarea */
.voice-input__textarea {
  display: block;
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
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


/* Mic button (embedded bottom-right) */
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

.voice-input__mic-icon {
  font-size: 1rem;
  display: block;
}

/* Status text (below textarea) */
.voice-input__status {
  font-size: 0.8125rem;
  margin-top: 0.375rem;
  min-height: 1.25rem;
}

.voice-input__status-text {
  color: #999;
  display: inline-block;
}

.voice-input__status-text--listening {
  color: #a855f7;
  font-weight: 500;
}

.voice-input__status-text--error {
  color: #dc2626;
  font-weight: 500;
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

@keyframes pill-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.35); }
  50% { box-shadow: 0 0 0 5px rgba(168, 85, 247, 0); }
}

</style>
