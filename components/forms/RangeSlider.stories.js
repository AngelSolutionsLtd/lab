import { ref } from 'vue'
import RangeSlider from './RangeSlider.vue'

export default {
  title: 'Components/Range Slider',
  component: RangeSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A styled range slider with a gradient track (red→yellow→green), purple-outline thumb, and live value readout.'
      }
    }
  },
  argTypes: {
    modelValue: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Current value' },
    min: { control: 'number', description: 'Minimum value' },
    max: { control: 'number', description: 'Maximum value' },
    label: { control: 'text', description: 'Label shown above the slider' },
    unit: { control: 'text', description: 'Unit suffix appended to values' },
    showGradient: { control: 'boolean', description: 'Show red→green gradient track' }
  }
}

const Template = (args) => ({
  components: { RangeSlider },
  setup() {
    const value = ref(args.modelValue ?? 50)
    return { args, value }
  },
  template: `
    <div style="max-width: 360px; padding: 24px;">
      <RangeSlider v-bind="args" v-model="value" />
    </div>
  `
})

export const Default = Template.bind({})
Default.args = {
  modelValue: 50,
  min: 0,
  max: 100,
  label: 'Set Threshold',
  unit: '%',
  showGradient: true
}

export const AttendanceThreshold = Template.bind({})
AttendanceThreshold.args = {
  modelValue: 68,
  min: 0,
  max: 100,
  label: 'Set Overall Attendance Threshold',
  unit: '%',
  showGradient: true
}

export const LowValue = Template.bind({})
LowValue.args = {
  modelValue: 20,
  min: 0,
  max: 100,
  label: 'Set Threshold',
  unit: '%',
  showGradient: true
}
