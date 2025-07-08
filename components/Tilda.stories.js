import { ref } from 'vue';
import TinyMceEditor from './TinyMceEditor.vue';
import Modal from './Modal';
import '../Modules/TildaPlugin/tilda.js';

export default {
  title: 'Components/Ai/Tilda',
component: TinyMceEditor,
};

const Template = (args) => ({
  components: { TinyMceEditor, Modal },
  setup() {
    const showModal = ref(false);
    const activeEditorId = ref(null);

    const handleTildaClicked = (editorId) => {
      activeEditorId.value = editorId;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    return { args, handleTildaClicked, showModal, closeModal, activeEditorId };
  },
  template: `
    <div style="max-width: 800px; margin: auto;">
      <TinyMceEditor v-bind="args" @tilda-clicked="handleTildaClicked" />
      <Modal v-if="showModal" :editorId="activeEditorId" @close="closeModal">
        <template #header>
          <h2>Example Modal</h2>
        </template>

        <p>This is some simple markup inside your modal for Storybook presentation.</p>

        <template #footer>
          <button type="button" class="button" @click="closeModal">Close</button>
        </template>
    </Modal>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  initialValue: '<p>Hello TinyMCE</p>',
  editorId: 'storybook-tinymce',
  init: {
    height: 300,
    menubar: false,
    plugins: ['advlist', 'lists', 'link', 'table', 'fullscreen', 'tilda'],
    toolbar: [
      'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table fullscreen',
      'tilda'
    ].join('\n'),
    skin_url: 'https://cdn.jsdelivr.net/npm/tinymce@6.8.3/skins/ui/oxide',
    content_css: 'https://cdn.jsdelivr.net/npm/tinymce@6.8.3/skins/content/default/content.min.css',
  },
  settings: {
    branding: true,
  },
};
