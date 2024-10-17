import MyButton from './Button.vue';

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
    },
    roundedCorners: {           // Add the roundedCorners control
      control: { type: 'boolean' }
    }
  },
};

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

// Example with rounded corners
export const Rounded = {
  args: {
    size: 'large',
    label: 'Rounded Button',
    roundedCorners: true
  },
};
