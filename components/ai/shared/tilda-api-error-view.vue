<template>
  <user-message-component v-if="message" type="negative">
    <div class="text-left">
      <strong class="rag--red-d40 mb-2">{{ message.title }}</strong>
      <p class="mb-0 rag--red-d40">{{ message.desc }}</p>
    </div>
  </user-message-component>
</template>

<script setup>
import { computed } from 'vue'
import UserMessageComponent from '../../feedback/UserMessage.vue'

const props = defineProps({
  errorType: {
    type: String,
    default: ''
  }
})

const message = computed(() => {
  switch (props.errorType) {
    case 'AI_UNAVAILABLE':
      return {
        title: 'We are having trouble processing your request right now.',
        desc: 'The AI service is temporarily unavailable. Please try again later.'
      }
    case 'NETWORK_ERROR':
      return {
        title: 'Something went wrong.',
        desc: 'We could not process your request. Check your connection and try again.'
      }
    case 'TIMEOUT':
      return {
        title: 'The request timed out.',
        desc: 'The server took too long to respond. Please try again in a moment.'
      }
    case 'FILE_TOO_LARGE':
      return {
        title: 'Your file is too large.',
        desc: 'Please upload a smaller document and try again.'
      }
    default:
      return null
  }
})
</script>
