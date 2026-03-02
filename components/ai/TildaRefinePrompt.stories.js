import { ref, computed } from 'vue'
import TildaRefinePrompt from './TildaRefinePrompt.vue'

export default {
  title: 'Components/AI/TildaRefinePrompt',
  component: TildaRefinePrompt,
  tags: ['autodocs'],
  argTypes: {
    errorState: {
      control: 'select',
      options: ['', 'AI_UNAVAILABLE', 'NETWORK_ERROR', 'TIMEOUT', 'FILE_TOO_LARGE'],
      description: 'Show error state'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state'
    }
  }
}

const Template = (args) => ({
  components: { TildaRefinePrompt },
  setup() {
    const showPrompt = ref(true)
    const content = ref('This is some sample text that you might want to refine using Tilda.')
    const refineInstruction = ref('')

    // Use computed to make args reactive
    const error = computed(() => args.errorState || '')
    const loading = computed(() => args.loading || false)

    const openRefinePrompt = () => {
      showPrompt.value = true
    }

    const closePrompt = () => {
      showPrompt.value = false
      refineInstruction.value = ''
    }

    const handleRefine = async (instruction) => {
      console.log('Refining with instruction:', instruction)
    }

    return { showPrompt, content, refineInstruction, loading, error, openRefinePrompt, closePrompt, handleRefine }
  },
  template: `
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-6">
          <div style="position: relative;">
            <h3 style="margin-bottom: 10px;">Content Editor</h3>
            <button
              class="btn btn--tilda--inverted px-2"
              @click="openRefinePrompt"
              style="position: absolute; top: 0; right: 0;"
              v-if="!showPrompt"
            >
              <span class="entypo--twinkle"></span>
            </button>
          </div>

          <textarea
            v-model="content"
            rows="8"
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;"
            placeholder="Enter your content here..."
          ></textarea>
        </div>
      </div>

      <!-- Refine prompt overlay -->
      <div
        v-if="showPrompt"
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;"
        @click.self="closePrompt"
      >
        <div class="tilda-ai-refine-modal panel" style="max-width: 470px; width: 100%; position: absolute; top: 0;">
          <TildaRefinePrompt
            v-model="refineInstruction"
            :loading="loading"
            :error="error"
            @close="closePrompt"
            @refine="handleRefine"
          />
        </div>
      </div>
    </div>
  `
})

export const Default = Template.bind({})
Default.args = {
  errorState: '',
  loading: false
}
