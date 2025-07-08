import { h } from 'vue';
import TippyWrapper from './TippyWrapper.vue';

export default {
  title: 'Components/TippyWrapper',
  component: TippyWrapper,
  tags: ['autodocs'],
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
    const onHide = () => console.log('Tooltip hidden');
    const onHidden = () => console.log('Tooltip has been completely hidden');
    return { args, onHide, onHidden, h };
  },
  render() {
    return h(
      'div',
      { style: 'max-width: 300px' },
      h(
        TippyWrapper,
        {
          tippyOptions: this.args.tippyOptions,
          onHide: this.onHide,
          onHidden: this.onHidden,
        },
        {
          triggerTarget: () =>
            this.args.triggerSlot
              ? h('div', { innerHTML: this.args.triggerSlot })
              : null,
          content: () =>
            this.args.contentSlot
              ? h('div', { innerHTML: this.args.contentSlot })
              : null,
        }
      )
    );
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
      <a class="options-tooltip__link" @click.prevent="">
        <i class="entypo--pencil"></i>Edit
      </a>
      <a class="options-tooltip__link" @click.prevent="">
        <i class="entypo--copy"></i>Duplicate
      </a>
      <hr class="rule">
      <a class="options-tooltip__link" @click.prevent="">
        <i class="entypo--trash"></i>Delete
      </a>
    </div>`,
};
