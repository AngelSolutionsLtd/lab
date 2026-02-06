import AppShell from '../components/AppShell.vue'
import ClusterMap from '../components/map/ClusterMap.vue'

export default {
  title: 'Pages/Maps/ClusterMap',
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
  components: { ClusterMap },
  setup() { return { args } },
  template: `
    <div style="position:relative;height:100vh;width:100%;">
      <ClusterMap :key="args.remountKey" />
    </div>
  `
})

export const Default = Template.bind({})
Default.args = { remountKey: 'default' }

export const FreshSeed = Template.bind({})
FreshSeed.args = { remountKey: `seed-${Date.now()}` }
