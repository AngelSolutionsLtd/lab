import MyButton from './Button.vue';

export default {
  title: 'Components/Button',
  component: MyButton,
  tags: ['autodocs'],
  argTypes: {
    btnColor: { 
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'positive', 'negative']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'large', 'huge', 'full'],
    },
    roundedCorners: {
      control: { type: 'boolean' }
    }
  },
};

const Template = (args) => ({
  components: { MyButton },
  setup() {
    const onClick = () => {
      console.log('Button clicked');
    };
    return { args, onClick };
  },
  template: '<MyButton v-bind="args" @onClick="onClick" />',
});

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Huge = Template.bind({});
Huge.args = {
  size: 'huge',
  label: 'Button',
};

export const Full = Template.bind({});
Full.args = {
  size: 'full',
  label: 'Button',
};

export const Rounded = Template.bind({});
Rounded.args = {
  size: 'large',
  label: 'Rounded Button',
  roundedCorners: true,
};
