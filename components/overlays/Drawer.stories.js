import { ref, watch } from 'vue';

import Drawer from './Drawer.vue';

export default {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean', description: 'Controls the drawer visibility. The drawer is fully controlled - it never closes itself, the parent owns the state.' },
    direction: { control: 'select', options: ['right', 'left'], description: 'Side of the viewport the drawer slides in from' },
    hasSideBtn: { control: 'boolean', description: 'Keeps the drawer mounted while closed so a side tab/button stays visible' },
    scrollLocked: { control: 'boolean', description: 'Locks scrolling on the page body while the drawer is open' },
    wrapperPadding: { control: 'text', description: 'Utility padding class applied to the drawer wrapper' },
    alignTop: { control: 'boolean', description: 'Pins the drawer to the top of the viewport at full height' },
    noOverlay: { control: 'boolean', description: 'Hides the dimmed overlay behind the drawer' },
    headerSlot: { control: 'text', table: { disable: true } },
    defaultSlot: { control: 'text', table: { disable: true } },
    additionalContentSlot: { control: 'text', table: { disable: true } },
    footerSlot: { control: 'text', table: { disable: true } },
  },
};

const Template = (args) => ({
  components: { Drawer },
  setup() {
    const isOpen = ref(args.isOpen);

    // Keep the local state in step with the isOpen control in the addons panel.
    watch(() => args.isOpen, (open) => {
      isOpen.value = open;
    });

    const openDrawer = () => {
      isOpen.value = true;
    };

    const closeDrawer = () => {
      isOpen.value = false;
    };

    return { args, isOpen, openDrawer, closeDrawer };
  },
  template: `
    <div style="min-height: 400px">
      <button class="btn btn--secondary" @click.prevent="openDrawer">Open Drawer</button>

      <Drawer v-bind="args" :is-open="isOpen">
        <template #header v-if="args.headerSlot">
          <div class="d-flex align-items-center">
            <div v-html="args.headerSlot"></div>
            <span class="entypo--cancel-circled ml-auto" @click.prevent="closeDrawer"></span>
          </div>
        </template>

        <div v-if="args.defaultSlot" v-html="args.defaultSlot"></div>

        <template #additionalContent v-if="args.additionalContentSlot">
          <div v-html="args.additionalContentSlot"></div>
        </template>

        <template #footer v-if="args.footerSlot">
          <div v-html="args.footerSlot"></div>
        </template>
      </Drawer>
    </div>
  `
});

const longBodyContent = `
  <p>Slot content sits in the scrollable body of the drawer.</p>
  <p>When the content grows taller than the drawer, the MutationObserver picks up the change and the footer is pinned to the bottom so its actions stay reachable.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
`;

export const Default = Template.bind({});
Default.args = {
  isOpen: false,
  direction: 'right',
  hasSideBtn: false,
  scrollLocked: true,
  wrapperPadding: 'py-5',
  alignTop: false,
  noOverlay: false,
  headerSlot: '<h1>Drawer Header</h1>',
  defaultSlot: '<p>This is the default content for the drawer body.</p>',
  additionalContentSlot: '',
  footerSlot: ''
};

export const SlideFromLeft = Template.bind({});
SlideFromLeft.args = {
  ...Default.args,
  direction: 'left',
  headerSlot: '<h1>Left Hand Drawer</h1>',
  defaultSlot: '<p>The direction prop drives both the transition name and the modifier class.</p>'
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  ...Default.args,
  headerSlot: '<h1>Drawer With Footer</h1>',
  defaultSlot: longBodyContent,
  footerSlot: '<button class="btn btn--secondary--inverted">Cancel</button> <button class="btn">Save</button>'
};
WithFooter.parameters = {
  docs: {
    description: {
      story: 'The footer becomes fixed once the drawer content is taller than the drawer itself. Resizing the window re-measures the content.'
    }
  }
};

export const WithAdditionalContent = Template.bind({});
WithAdditionalContent.args = {
  ...Default.args,
  headerSlot: '<h1>Additional Content</h1>',
  defaultSlot: '<p>The default slot renders first.</p>',
  additionalContentSlot: '<div><p>The additionalContent slot renders directly beneath it, inside the same scrollable body.</p></div>'
};

export const NoOverlay = Template.bind({});
NoOverlay.args = {
  ...Default.args,
  noOverlay: true,
  headerSlot: '<h1>No Overlay</h1>',
  defaultSlot: '<p>The dimmed overlay behind the drawer is hidden, so the page underneath stays fully visible.</p>'
};

export const AlignedToTop = Template.bind({});
AlignedToTop.args = {
  ...Default.args,
  alignTop: true,
  headerSlot: '<h1>Aligned To Top</h1>',
  defaultSlot: '<p>The drawer is pinned to the top of the viewport at full height, ignoring any offset from a page header.</p>'
};

export const ScrollUnlocked = Template.bind({});
ScrollUnlocked.args = {
  ...Default.args,
  scrollLocked: false,
  headerSlot: '<h1>Scroll Unlocked</h1>',
  defaultSlot: '<p>The page body keeps scrolling while the drawer is open.</p>'
};

export const WithSideButton = Template.bind({});
WithSideButton.args = {
  ...Default.args,
  hasSideBtn: true,
  headerSlot: '<h1>Side Button</h1>',
  defaultSlot: '<p>The drawer stays mounted when closed so a side tab can remain on screen as the handle to reopen it.</p>'
};

Default.parameters = {
  docs: {
    source: {
      code: `
<template>
  <div>
    <button class="btn btn--secondary" @click.prevent="isOpen = true">Open Drawer</button>

    <drawer-component :is-open="isOpen" direction="right">
      <template #header>
        <div class="d-flex align-items-center">
          <h1>Drawer Header</h1>
          <span class="entypo--cancel-circled ml-auto" @click.prevent="isOpen = false"></span>
        </div>
      </template>

      <p>This is the default content for the drawer body.</p>

      <template #footer>
        <button class="btn" @click.prevent="isOpen = false">Save</button>
      </template>
    </drawer-component>
  </div>
</template>
      `,
      language: 'html',
      format: true
    }
  }
};
