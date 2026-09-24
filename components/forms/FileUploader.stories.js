import FileUploader from './FileUploader.vue';

export default {
  title: 'Components/Forms/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
  argTypes: {
    hasAttachments: { control: 'boolean', description: 'Uses the compact dropzone' },
    isDisabled: { control: 'boolean', description: 'Blocks uploading' },
    multipleFiles: { control: 'boolean', description: 'Allows more than one file' },
    disabledMessage: { control: 'text', description: 'Names what files can be uploaded later' },
    showErrorInPopup: { control: 'boolean', description: 'Shows the invalid file type error' },
    hasWhiteBg: { control: 'boolean', description: 'White background rather than the default' },
    expectedFileTypes: { control: 'text', description: 'Accepted file types' },
    hideDismissFileTypeError: { control: 'boolean', description: 'Hides the close button on the inline file type' },
    onUpload: { action: 'upload', description: 'Emits the uploaded files' },
  },
};

const Template = (args) => ({
  components: { FileUploader },
  setup() {
    return { args };
  },
  template: '<div style="max-width: 640px"><FileUploader v-bind="args" /></div>',
});

export const Default = Template.bind({});
Default.args = {
  hasAttachments: false,
  isDisabled: false,
  multipleFiles: true,
  disabledMessage: 'development feedback',
  showErrorInPopup: false,
  hasWhiteBg: false,
  expectedFileTypes: '',
  hideDismissFileTypeError: false,
};