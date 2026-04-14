import TildaContentFeedback from './TildaContentFeedback.vue'

export default {
  title: 'Components/AI/TildaContentFeedback',
  component: TildaContentFeedback,
  tags: ['autodocs'],
  argTypes: {
    target: { control: 'number' },
    feedbackLeft: { control: 'boolean' },
    sectionKey: { control: 'text' },
    reason: { control: 'text' },
    onFeedback: { action: 'feedback' }
  }
}

const Template = (args) => ({
  components: { TildaContentFeedback },
  setup() {
    return { args }
  },
  template: '<TildaContentFeedback v-bind="args" @feedback="args.onFeedback" />'
})

export const Default = Template.bind({})
Default.args = {
  target: 123,
  feedbackLeft: false,
  sectionKey: 'example-section',
  reason: 'testing'
}
