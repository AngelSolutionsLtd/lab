import SimpleAccordion from './SimpleAccordion.vue'

export default {
  title: 'Components/Layout/Simple Accordion',
  component: SimpleAccordion,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Accordion title' },
    content: { control: 'text', description: 'Accordion content' },
    isOpen: { control: 'boolean', description: 'Controls the state of the accordion' },
  },
};

const accordionContent = [
  { title: 'What is a KPI?', content: '<p>Key Performance Indicators (KPIs) are powerful tools that provide measurable values, allowing Organisation leaders to evaluate the effectiveness and success of their schools.</p><p>KPIs can be aggregated into sets and arranged within layouts, offering a comprehensive overview of data for your schools.</p>' },
  { title: 'What is a KPI Set?', content: '<p>KPI Sets are groups of KPIs which can be set up to provide vital indicators for focused analysis and decision-making.</p><p>KPI Sets transform individual KPIs into specific sets, giving actionable intelligence to drive meaningful improvements across the trust.</p>' },
  { title: 'What is a Layout?', content: '<p>A KPI Layout is a collection of KPI Sets, which are themselves made up of any number of individual KPIs.</p><p>Layouts allow you to organise and view KPI Sets based on their content, area, or intended audience.</p>' },
];

const Template = (args) => ({
  components: { SimpleAccordion },
  setup() { return { args }; },
  template: `<div style="max-width: 400px"><SimpleAccordion v-for="(item, i) in args.items" :key="i" v-bind="item" :isOpen="args.openIndex === i" @toggle="args.openIndex = args.openIndex === i ? null : i" /></div>`,
});

export const Default = Template.bind({});
Default.args = {
  openIndex: null,
  items: accordionContent
};