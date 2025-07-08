import TinyMceEditor from './TinyMceEditor.vue';

export default {
  title: 'Components/TinyMceEditor',
  component: TinyMceEditor,
};

const Template = (args) => ({
  components: { TinyMceEditor },
  setup() {
    return { args };
  },
  template: `
    <div style="max-width: 800px; margin: auto;">
      <TinyMceEditor v-bind="args" />
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
    plugins: ['advlist', 'lists', 'link', 'table', 'fullscreen'],
    skin_url: 'https://cdn.jsdelivr.net/npm/tinymce@6.8.3/skins/ui/oxide',
    content_css: 'https://cdn.jsdelivr.net/npm/tinymce@6.8.3/skins/content/default/content.min.css',
    toolbar:
      'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | fullscreen',
      
  },
  settings: {
    branding: true,
  },
};
