import SvgMapMarker from './Marker.vue';

export default {
  title: 'Components/Map/Marker',
  component: SvgMapMarker,
  tags: ['autodocs'],
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

// ✅ Use render instead of Template
export const Default = {
  args: {
    rollSize: 'md',
    balance: 'neutral',
    phase: 'A',
    hexColor: '#698BAB'
  },
  render: (args) => ({
    components: { SvgMapMarker },
    setup() {
      return { args };
    },
    template: '<SvgMapMarker v-bind="args" />'
  })
};
