import SvgMapMarker from './Marker.vue';

export default {
  title: 'Components/Map/Marker',
  component: SvgMapMarker,
  argTypes: {
    rollSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    balance: {
      control: { type: 'select' },
      options: ['positive', 'neutral', 'negative']
    },
    phase: {
      control: { type: 'select' },
      options: ['A', 'P', 'S', 'N', 'SP']
    },
    hexColor: { control: 'color' }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SvgMapMarker },
  template: '<SvgMapMarker v-bind="$props" />'
});

export const Default = Template.bind({});
Default.args = {
  rollSize: 'md',
  balance: 'neutral',
  phase: 'A',
  hexColor: '#698BAB'
};
