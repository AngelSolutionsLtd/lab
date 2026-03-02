import AppShell from '../components/AppShell.vue'
import HeatMap from '../components/map/Heatmap.vue'

export default {
  title: 'Pages/Maps/HeatMap',
  decorators: [
    () => ({
      components: { AppShell },
      template: `<AppShell :fullWidth="true"><story /></AppShell>`
    })
  ],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    remountKey: { control: 'text' }
  }
}

const Template = (args) => ({
  components: { HeatMap },
  setup() { return { args } },
  template: `
    <div style="position:relative;height:100vh;width:100%;">
      <HeatMap :key="args.remountKey" />
    </div>
  `
})

export const Default = Template.bind({})
Default.args = {
  remountKey: 'default'
}
