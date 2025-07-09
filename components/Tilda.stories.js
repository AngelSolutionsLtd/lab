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

export const TildaWithBanner = Template.bind({});
TildaWithBanner.args = {
  ...Default.args,
  initialValue: `
    <div class="tilda-banner" contenteditable="false" style="
      border: 1px solid #993DB8;
      background: linear-gradient(94deg, #FCFAFF 14.56%, #F9F5FE 104.6%);
      padding: 1.2rem;
      border-radius: 6px;
      position: relative;
      font-family: sans-serif;
      margin-bottom: 1rem;
    ">
      <strong style="font-size: 1rem;">
        ⚡ Jump start your SEF with <span style="color: #9b00d1;">Tilda</span>
      </strong>
      <p style="margin-top: 0.5rem;">
        Complete your BSQs, then let Tilda generate a custom draft. You’re in control, tweak, polish, and make it yours.
      </p>
      <button style="
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        border: none;
        background: none;
        font-size: 1.2rem;
        cursor: pointer;
      " onclick="this.parentElement.remove()">×</button>
    </div>
    <p>Now you can start editing below the banner...</p>
  `,
};