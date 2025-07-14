import { ref } from 'vue';
import TinyMceEditor from './TinyMceEditor.vue';
import Modal from './Modal';
import Checkbox from './Checkbox';
import '../Modules/TildaPlugin/tilda.js';

export default {
  title: 'Components/Ai/Tilda',
  component: TinyMceEditor,
};

const Template = (args) => ({
  components: { TinyMceEditor, Modal, Checkbox },
  setup() {
    const showModal = ref(false);
    const activeEditorId = ref(null);
    const isGenerating = ref(false);
    const handleTildaClicked = (editorId) => {
      activeEditorId.value = editorId;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const injectAiContent = async () => {
      const editor = window.tinymce?.get('storybook-tinymce');
      const htmlContent = editor?.getContent({ format: 'html' })?.trim();
      if (!editor || !htmlContent) return;

      const prompt = `
        <!--
        The following is HTML content from a WYSIWYG editor.
        Please improve grammar, clarity, and formatting, but preserve the structure and return valid, usable HTML.
        Only return improved HTML. Do not add explanations or wrappers.
        -->
        ${htmlContent}
      `;

      isGenerating.value = true;

      try {
        const res = await fetch('https://tilda-steel.vercel.app/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        const { text } = await res.json();
        if (text) {
          editor.setContent(text);
          closeModal();
        }
      } catch (e) {
        console.error('AI injection failed', e);
      } finally {
        isGenerating.value = false;
      }
    };


    return {
      args,
      handleTildaClicked,
      showModal,
      isGenerating,
      closeModal,
      activeEditorId,
      injectAiContent,
    };
  },
  template: `
    <div style="max-width: 800px; margin: auto;">
      <TinyMceEditor v-bind="args" @tilda-clicked="handleTildaClicked" />
      <Modal v-if="showModal" classes="modal--full-page" :editorId="activeEditorId" @close="closeModal" dismissible>
        <template #header>
          <h2>Tilda</h2>
        </template>
        <div class="row justify-content-center text-center">
          <div class="col-7">
            <p class="mb-2">
              We’ll review what you’ve written &amp; <br>suggest some improvements based on the: <br><span class="italic"><strong>6 of 12 BSQs</strong> completed, last updated <strong>16/02/25</strong></span>
            </p> 
          </div>
          <div class="col-7 mt-3 d-flex justify-content-center"> 
            <div class="d-flex italic">
              <Checkbox class="mr-2" />Ignore Bite-sized Questions
            </div>
          </div>
        </div>

        <template #footer>
          <button type="button" class="btn btn--secondary--inverted mr-4" @click="closeModal">
            <span class="entypo--cancel-circled mr-2"></span> Cancel</button>
          <button type="button" class="btn ai-button" :class="[{ isGenerating: isGenerating }]" @click="injectAiContent">
            <span :class="['entypo--arrows-ccw', 'mr-2', { spinner: isGenerating }]"></span> {{ isGenerating ? 'Generating' : 'Generate'}}</button>
        </template>
      </Modal>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  initialValue: '<p>Our skool called St Bumble’s done a thing wiv the school frame thingy, and we got told we did ok but not brill. The ppl said we good at making kids sit quiet and line up nice, but we gotta do better at maths cos kids don’t know times tables much. They liked our new art wall and how Miss Jen sings songs in PE. We said we gonna try more homeworks and stop the rabbits coming in the dinner hall. Also our goal is more reading books what ain’t ripped and maybe fix the leaky pipe in Year 3.</p>',
  editorId: 'storybook-tinymce',
  init: {
    height: 300,
    menubar: false,
    plugins: ['advlist', 'lists', 'link', 'table', 'fullscreen', 'tilda'],
    toolbar: [
      'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table fullscreen',
      'tilda',
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
        Complete your BSQs, then let Tilda generate a custom draft. You’re in control—tweak, polish, and make it yours.
      </p>
      <button style="
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        border: none;
        background: none;
        font-size: 1.2rem;
        cursor: pointer;
      " onclick="this.parentElement.remove()">X</button>
    </div>
    <p>Now you can start editing below the banner...</p>
  `,
};

export const TildaWithPlaceholder = Template.bind({});
TildaWithPlaceholder.args = {
  init: {
    ...Default.args.init,
    plugins: [...Default.args.init.plugins, 'placeholder'],
    placeholder: 'Start typing here or use Tilda to generate a draft for you using your BSQs.',
    setup: (editor) => {
      editor.on('init', () => {
        const style = `
          .mce-content-body::before {
            color: #a084f9 !important;
            font-style: italic;
          }
        `;
        const doc = editor.getDoc?.();
        if (doc) {
          const styleTag = doc.createElement('style');
          styleTag.innerHTML = style;
          doc.head.appendChild(styleTag);
        }
      });
    },
  },
};
