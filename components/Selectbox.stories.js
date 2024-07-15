import SelectBox from './Selectbox.vue'; // Import your SelectBox component

export default {
  title: 'Components/Forms/Selectbox', // Title for the SelectBox component stories
  component: SelectBox, // Specify the component you're showcasing
};

// Default story with basic options
export const Default = () => ({
  components: { SelectBox },
  template: '<div style="max-width: 300px"><SelectBox :options="defaultOptions" /></div>',
  data() {
    return {
      defaultOptions: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    };
  },
});