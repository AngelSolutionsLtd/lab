import MyButton from './Button.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Button',
  component: MyButton,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MyButton },
    template: '<my-button @onClick="onClick" v-bind="$props" />',
  }),
  argTypes: {
    btnColor: { 
      control: { type: 'select' },
      options: ['primary','secondary','tertiary', 'quaternary', 'positive', 'negative']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'large', 'huge', 'full'],
    } 
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Huge = {
  args: {
    size: 'huge',
    label: 'Button',
  },
};

export const Full = {
  args: {
    size: 'full',
    label: 'Button',
  },
};