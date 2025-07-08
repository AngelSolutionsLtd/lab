import { ref } from 'vue';
import Modal from './Modal.vue';

export default {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
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

const Template = (args) => ({
  components: { Modal },
  setup() {
    const showModal = ref(false);
    const onClose = () => { showModal.value = false; };
    const openModal = () => { showModal.value = true; };

    return { args, showModal, onClose, openModal };
  },
  template: `
    <div style="min-height: 300px">
      <button class="btn btn--secondary" @click="openModal">Open Modal</button>
      <Modal v-if="showModal" v-bind="args" @close="onClose">
        <template #header v-if="args.headerSlot">
          <div v-html="args.headerSlot"></div>
        </template>

        <div v-if="args.defaultSlot" v-html="args.defaultSlot"></div>

        <template #footer v-if="args.footerSlot">
          <div v-html="args.footerSlot"></div>
        </template>
      </Modal>
    </div>
  `,
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
  footerSlot: '<button class="btn btn--secondary--inverted">Close</button>',
};

export const FullPage = Template.bind({});
FullPage.args = {
  dismissible: false,
  overflowContents: false,
  classes: 'modal--full-page',
  loading: false,
  disabled: false,
  headerSlot: '<h2>Full Page Modal</h2>',
  defaultSlot: `
    <div>
      <p>Long modal content here...</p>
      <p>Additional paragraphs to demonstrate scrolling behaviour...</p>
    </div>
  `,
  footerSlot: '<button class="btn btn--secondary--inverted">Close</button>',
};

Default.parameters = {
  docs: {
    source: {
      code: `
<template>
  <div>
    <button class="btn btn--secondary" @click="showModal = true">Open Modal</button>
    <modal-component v-if="showModal" @close="showModal = false">
      <template #header>
        <h2>Default Modal Header</h2>
      </template>
      <p>This is the default content for the modal body.</p>
      <template #footer>
        <button class="btn btn--secondary--inverted" @click="showModal = false">Close</button>
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
