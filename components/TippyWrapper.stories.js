import TippyWrapper from './TippyWrapper.vue'; // Import your TippyWrapper component

// Default story with basic options
export default {
  title: 'Components/TippyWrapper',
  component: TippyWrapper,
  tags: ['autodocs'],
  render: (args) => ({
    components: { TippyWrapper },
    setup() {
      return { args };  // Make sure to pass `args` to the setup function
    },
    template: `
      <div style="max-width: 300px">
        <TippyWrapper v-bind="args.tippyOptions" @hide="onHide" @hidden="onHidden">
          ${args.triggerSlot ? `<template #triggerTarget>${args.triggerSlot}</template>` : ''}
          ${args.contentSlot ? `<template #content>${args.contentSlot}</template>` : ''}
        </TippyWrapper>
      </div>
    `,
    methods: {
      onHide() {
        console.log('Tooltip hidden');
      },
      onHidden() {
        console.log('Tooltip has been completely hidden');
      },
    },
  }),
  argTypes: {
    tippyOptions: {
      control: 'object',
      description: 'Configuration options for Tippy.js tooltip',
    },
    triggerSlot: { control: 'text', table: { disable: true } },
    contentSlot: { control: 'text', table: { disable: true } },
  },
};

const Template = (args) => ({
  components: { TippyWrapper },
  setup() {
    return { args };  // Make sure to pass `args` to the setup function
  },
  template: `
    <div style="max-width: 300px">
      <TippyWrapper v-bind="args.tippyOptions" @hide="onHide" @hidden="onHidden">
        ${args.triggerSlot ? `<template #triggerTarget>${args.triggerSlot}</template>` : ''}
        ${args.contentSlot ? `<template #content>${args.contentSlot}</template>` : ''}
      </TippyWrapper>
    </div>
  `,
  methods: {
    onHide() {
      console.log('Tooltip hidden');
    },
    onHidden() {
      console.log('Tooltip has been completely hidden');
    },
  },
});

export const Default = Template.bind({});
Default.args = {
  tippyOptions: {
    zIndex: '9999',
    placement: 'bottom',
    trigger: 'click',
    maxWidth: '1000px',
    theme: 'psp responsive',
    interactive: true,
  },
  triggerSlot: '<button class="btn btn--secondary--inverted">Options</button>',
  contentSlot: `
    <div class="options-tooltip has-min-width pl-0">
        <a class="options-tooltip__link"  @click.prevent="">
            <i class="entypo--pencil" />Edit
        </a>
        <a class="options-tooltip__link"  @click.prevent="">
            <i class="entypo--copy" />Duplicate
        </a>
        <hr class="rule">
        <a class="options-tooltip__link"  @click.prevent="">
            <i class="entypo--trash" />Delete
        </a>
    </div>`,
};