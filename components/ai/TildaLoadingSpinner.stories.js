import TildaLoadingSpinner from './TildaLoadingSpinner.vue'

export default {
  title: 'Components/AI/TildaLoadingSpinner',
  component: TildaLoadingSpinner,
  tags: ['autodocs']
}

const Template = (args) => ({
  components: { TildaLoadingSpinner },
  setup() {
    return { args }
  },
  template: '<TildaLoadingSpinner v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
