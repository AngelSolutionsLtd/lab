import Modal from './Modal.vue';

export default {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Modal },
    template: `
      <div style="min-height: 600px">
        <button class="btn btn--secondary" @click="showModal = true">Open Modal</button>
        <Modal v-if="showModal" v-bind="filteredProps" @close="onClose">
          ${args.headerSlot ? `<template #header>${args.headerSlot}</template>` : ''}
          ${args.defaultSlot ? `<div>${args.defaultSlot}</div>` : ''}
          ${args.footerSlot ? `<template #footer>${args.footerSlot}</template>` : ''}
        </Modal>
      </div>
    `,
    data() {
      return {
        showModal: false, // Control visibility of the modal
      };
    },
    computed: {
      filteredProps() {
        const { headerSlot, defaultSlot, footerSlot, ...props } = this.$props;
        return props;
      },
    },
    methods: {
      onClose() {
        this.showModal = false;
      }
    },
  }),
  argTypes: {
    dismissible: { control: 'boolean' },
    overflowContents: { control: 'boolean' },
    classes: { control: 'text' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    headerSlot: { control: 'text', table: { disable: true } },
    defaultSlot: { control: 'text', table: { disable: true } },
    footerSlot: { control: 'text', table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Modal },
  template: `
    <div style="min-height: 300px">
      <button class="btn btn--secondary" @click="showModal = true">Open Modal</button>
      <Modal v-if="showModal" v-bind="filteredProps" @close="onClose">
        ${args.headerSlot ? `<template #header>${args.headerSlot}</template>` : ''}
        ${args.defaultSlot ? `<div>${args.defaultSlot}</div>` : ''}
        ${args.footerSlot ? `<template #footer>${args.footerSlot}</template>` : ''}
      </Modal>
    </div>
  `,
  data() {
    return {
      showModal: false, // Control visibility of the modal
    };
  },
  computed: {
    filteredProps() {
      const { headerSlot, defaultSlot, footerSlot, ...props } = this.$props;
      return props;
    },
  },
  methods: {
    onClose() {
      this.showModal = false;
    }
  },
});

export const Default = Template.bind({});
Default.args = {
  dismissible: true,
  overflowContents: false,
  classes: '',
  loading: false,
  disabled: false,
  headerSlot: '<h2>Default Modal Header</h2>',
  defaultSlot: '<p>This is the default content for the modal body.</p>',
  footerSlot: '<button class="btn btn--secondary--inverted" @click="onClose">Close</button>',
};

export const FullPage = Template.bind({});
FullPage.args = {
  dismissible: false,
  overflowContents: false,
  classes: 'modal--full-page',
  loading: false,
  disabled: false,
  hasScrollBar: true,
  headerSlot: '<h2>Full Page Modal</h2>',
  defaultSlot: `
    <div>
      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Praesent vitae neque porta hendrerit nulla id tincidunt eros. Praesent consequat lacus id mi maximus sit amet commodo eros mollis. Praesent purus tellus interdum et massa non condimentum mollis arcu. Praesent scelerisque sodales varius. Maecenas semper et massa sed cursus. Quisque porttitor finibus elit pharetra scelerisque. Aliquam ullamcorper dui eu aliquet accumsan. Nulla iaculis magna dolor vitae rutrum ipsum molestie vel. Curabitur bibendum lacus vitae fermentum bibendum. Pellentesque sed libero eget ipsum tempus posuere imperdiet vitae sem. Sed condimentum arcu venenatis ipsum tempor sit amet fermentum mi cursus. Proin accumsan eu nulla nec consequat. Mauris sollicitudin finibus lacus lobortis condimentum. Nullam id nibh bibendum lacinia purus non volutpat nisi.</p>
      <p>Maecenas tempus ultricies magna sit amet ultrices orci finibus nec. Suspendisse semper sapien nunc quis bibendum lacus convallis eget. In aliquam blandit massa et auctor ante condimentum sit amet. Curabitur pellentesque lectus eu condimentum condimentum. Nullam nibh orci facilisis ac accumsan eleifend cursus id magna. Nam bibendum erat non suscipit tristique eros turpis porta velit eget elementum diam ligula id leo. Suspendisse posuere velit in tempus pulvinar lectus felis sollicitudin sapien a gravida quam erat quis eros.</p>
      <p>Cras vel nulla tincidunt egestas ex sit amet venenatis erat. Phasellus malesuada sapien et arcu vestibulum bibendum. Ut scelerisque erat at consequat suscipit nulla elit dignissim risus eget elementum lacus metus eget quam. Cras consectetur odio vel bibendum blandit. Nullam quam augue faucibus at orci id ullamcorper finibus lectus. Proin pharetra nibh nisi eu faucibus elit consectetur non. Quisque tempor sapien fringilla laoreet congue nibh odio pretium magna in porttitor sapien diam nec lorem. Lorem ipsum dolor sit amet consectetur adipiscing elit. Suspendisse justo purus vehicula a convallis a ultrices non purus. In ac leo mauris. Integer ultrices eros in viverra vestibulum.</p>
      <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse rhoncus consectetur vulputate. Sed vestibulum ultrices luctus. Proin quis neque metus. Donec porta orci non placerat mollis sapien sem feugiat ex at suscipit turpis nisi id ipsum. Aenean rhoncus tellus at consequat gravida libero lectus laoreet sapien in convallis massa risus eu libero. Praesent lobortis malesuada ante sed fermentum mauris vestibulum ac. Proin at purus felis. Maecenas nec quam arcu. Nulla eu ante consequat dui mattis aliquet eget quis urna.</p>
      <p>Cras quam sem sodales et ante ac mattis euismod nibh. Duis condimentum lectus sed mollis consequat. Nunc rutrum tincidunt metus euismod fermentum orci imperdiet vitae. Vestibulum euismod dictum scelerisque. Donec quis felis quam. Duis urna neque semper nec ipsum a porta luctus dolor. Praesent congue nisl scelerisque varius sagittis mauris erat hendrerit ligula vel posuere sem mauris nec enim. Nam vel urna magna. Fusce ex ante lacinia non faucibus et tempus id turpis. Aenean sit amet mollis nunc at efficitur augue. Sed iaculis purus nec arcu sodales ultrices. Nullam vel orci tellus.</p>
    </div>
  `,
  footerSlot: '<button class="btn btn--secondary--inverted" @click="onClose">Close</button>',
};

Default.parameters = {
  docs: {
    source: {
      code: `
<template>
  <div>
    <button class="btn btn--secondary" @click="showModal = true">Open Modal</button>
    <modal-component v-if="showModal" @close="onClose">
      <template v-slot:header>
        <h2>Default Modal Header</h2>
      </template>
      <div>
        <p>This is the default content for the modal body.</p>
      </div>
      <template v-slot:footer>
        <button class="btn btn--secondary--inverted" @click="onClose">Close</button>
      </template>
    </modal-component>
  </div>
</template>
      `,
      language: 'html',
      format: true
    },
  },
};
