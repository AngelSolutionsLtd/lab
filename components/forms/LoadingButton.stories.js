import LoadingButton from './LoadingButton.vue';

export default {
  title: 'Components/Forms/LoadingButton',
  component: LoadingButton,
  tags: ['autodocs'],
  argTypes: {
    buttonText: { control: 'text' },
    buttonClass: { control: 'text' },
    icon: { control: 'text', description: 'CSS icon class (e.g. entypo--check)' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingText: { control: 'text', description: 'Text shown while loading (dotted style only)' },
    loaderStyle: {
      control: 'radio',
      options: ['dotted', 'spinner'],
      description: '"dotted" shows animated dots, "spinner" shows a spinning icon alongside the button text',
    },
    onButtonClicked: { action: 'buttonClicked' },
  },
};

const Template = (args) => ({
  components: { LoadingButton },
  setup() { return { args }; },
  template: `<LoadingButton v-bind="args" @buttonClicked="args.onButtonClicked" />`,
});

export const Default = Template.bind({});
Default.args = {
  buttonText: 'Save',
  buttonClass: 'btn btn--primary',
  icon: 'entypo--check',
  loading: false,
  disabled: false,
  loaderStyle: 'dotted',
};

export const LoadingDotted = Template.bind({});
LoadingDotted.args = {
  buttonText: 'Saving',
  buttonClass: 'btn btn--primary',
  loading: true,
  loaderStyle: 'dotted',
};

export const LoadingDottedWithText = Template.bind({});
LoadingDottedWithText.args = {
  buttonText: 'Saving',
  buttonClass: 'btn btn--primary',
  loading: true,
  loadingText: 'Saving changes…',
  loaderStyle: 'dotted',
};

export const LoadingSpinner = Template.bind({});
LoadingSpinner.args = {
  buttonText: 'Tilda: Generate',
  buttonClass: 'btn btn--tilda',
  icon: 'entypo--twinkle',
  loading: true,
  loaderStyle: 'spinner',
};

export const Disabled = Template.bind({});
Disabled.args = {
  buttonText: 'Save',
  buttonClass: 'btn btn--primary',
  disabled: true,
  loaderStyle: 'dotted',
};
