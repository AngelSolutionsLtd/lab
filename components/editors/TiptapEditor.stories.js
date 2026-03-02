import { ref } from 'vue';
import TiptapEditor from './TiptapEditor.vue';

export default {
  title: 'Components/Editors/Tiptap Editor',
  component: TiptapEditor,
  argTypes: {
    modelValue: { control: 'text' },
    height: { control: 'number' },
    editable: { control: 'boolean' },
    placeholder: { control: 'text' },
    features: { control: 'object' },
  },
};

const SAMPLE_CONTENT = `
  <h2>Welcome to Tiptap</h2>
  <p>This is a fully <strong>configurable</strong> WYSIWYG editor built on <em>Tiptap</em> — no expensive licence required.</p>
  <p>You can control exactly which toolbar groups appear using the <code>features</code> prop.</p>
  <ul>
    <li>Bold, italic, underline, strikethrough</li>
    <li>Headings (H1–H4)</li>
    <li>Text alignment</li>
    <li>Bullet and numbered lists</li>
    <li>Hyperlinks</li>
    <li>Tables</li>
    <li>Fullscreen mode</li>
  </ul>
`.trim();

// ── Wrapper that wires v-model so the editor stays live in Storybook ──
const Template = (args) => ({
  components: { TiptapEditor },
  setup() {
    const content = ref(args.modelValue ?? SAMPLE_CONTENT);
    return { args, content };
  },
  template: `
    <div style="max-width: 860px; margin: 24px auto; font-family: sans-serif;">
      <TiptapEditor
        v-bind="args"
        v-model="content"
      />
      <details style="margin-top: 16px; font-size: 12px; color: #6b7280;">
        <summary style="cursor: pointer; user-select: none;">View HTML output</summary>
        <pre style="background:#f3f4f6; padding:12px; border-radius:4px; overflow:auto; margin-top:8px;">{{ content }}</pre>
      </details>
    </div>
  `,
});

// ── Stories ────────────────────────────────────────────────────────

/** All features enabled — mirrors the TinyMCE default story */
export const Default = Template.bind({});
Default.args = {
  modelValue: SAMPLE_CONTENT,
  height: 300,
  editable: true,
  placeholder: 'Start typing…',
  features: {}, // empty = all defaults on
};
Default.storyName = 'Default (all features)';

/** Text formatting only — useful for simple comment fields */
export const FormattingOnly = Template.bind({});
FormattingOnly.args = {
  modelValue: '<p>Just <strong>bold</strong>, <em>italic</em>, <u>underline</u> and <s>strikethrough</s>.</p>',
  height: 200,
  features: {
    history: true,
    formatting: true,
    headings: false,
    alignment: false,
    lists: false,
    links: false,
    tables: false,
    fullscreen: false,
  },
};
FormattingOnly.storyName = 'Formatting only';

/** Full editor minus tables */
export const NoTables = Template.bind({});
NoTables.args = {
  modelValue: SAMPLE_CONTENT,
  height: 300,
  features: {
    tables: false,
    fullscreen: false,
  },
};
NoTables.storyName = 'No tables';

/** Minimal — headings + formatting + lists, no links or tables */
export const Minimal = Template.bind({});
Minimal.args = {
  modelValue: '<h3>Minimal editor</h3><p>Headings, formatting and lists only.</p>',
  height: 250,
  features: {
    history: true,
    formatting: true,
    headings: true,
    alignment: false,
    lists: true,
    links: false,
    tables: false,
    fullscreen: false,
  },
};
Minimal.storyName = 'Minimal';

/** Read-only — renders content without any editing capability */
export const ReadOnly = Template.bind({});
ReadOnly.args = {
  modelValue: SAMPLE_CONTENT,
  height: 300,
  editable: false,
  features: {}, // toolbar is hidden when editable is false
};
ReadOnly.storyName = 'Read-only';

/** Custom toolbar slot — demonstrates injecting extra buttons that call Vue actions */
export const CustomToolbar = (args) => ({
  components: { TiptapEditor },
  setup() {
    const content = ref(args.modelValue ?? SAMPLE_CONTENT);
    const saved = ref(false);

    const handleSave = (editor) => {
      // Example: call any Vue action here — API call, emit, store dispatch, etc.
      console.log('Saved HTML:', editor.getHTML());
      saved.value = true;
      setTimeout(() => { saved.value = false; }, 2000);
    };

    const handleClear = (editor) => {
      editor.chain().focus().clearContent().run();
    };

    return { args, content, saved, handleSave, handleClear };
  },
  template: `
    <div style="max-width: 860px; margin: 24px auto; font-family: sans-serif;">
      <TiptapEditor v-bind="args" v-model="content">
        <template #toolbar-actions="{ editor }">
          <button
            style="display:inline-flex;align-items:center;gap:5px;padding:0 10px;height:28px;border-radius:6px;border:1px solid #e5e7eb;background:white;font-size:12px;font-weight:500;cursor:pointer;color:#374151;"
            @mousedown.prevent="handleSave(editor)"
          >
            {{ saved ? '✓ Saved' : 'Save draft' }}
          </button>
          <button
            style="display:inline-flex;align-items:center;gap:5px;padding:0 10px;height:28px;border-radius:6px;border:1px solid #fecaca;background:#fff5f5;font-size:12px;font-weight:500;cursor:pointer;color:#dc2626;margin-left:4px;"
            @mousedown.prevent="handleClear(editor)"
          >
            Clear
          </button>
        </template>
      </TiptapEditor>
      <details style="margin-top: 16px; font-size: 12px; color: #6b7280;">
        <summary style="cursor: pointer; user-select: none;">View HTML output</summary>
        <pre style="background:#f3f4f6; padding:12px; border-radius:4px; overflow:auto; margin-top:8px;">{{ content }}</pre>
      </details>
    </div>
  `,
});
CustomToolbar.args = {
  modelValue: SAMPLE_CONTENT,
  height: 300,
  editable: true,
  placeholder: 'Start typing…',
  features: {},
};
CustomToolbar.storyName = 'Custom toolbar slot';
