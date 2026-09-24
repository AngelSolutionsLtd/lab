import DraggableTable from "./DraggableTable.vue";

export default {
  title: 'Components/Tables/DraggableTable',
  component: DraggableTable,
  tags: ['autodocs'],
    argTypes: {
      handle: { control: false, description:'Add the class .handle to any element to add draggable functionality', table: { category: 'CSS hooks' } },
      start:  { control: false, action: 'dragging', table: { category: 'Events' }},
      end: { control: false, action: 'dragging', table: { category: 'Events' } },
    }
};

const Template = (args) => ({
  components: { DraggableTable },
  setup() {
    return { args }
  },
  template: '<DraggableTable v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  draggableOptions: {
    tag: 'tbody',
    class: 'list-group',
    handle: '.handle',
    interactive: true,
    start: true,
    end: false,
    disabled: 'isMobile',
    itemKey: 'publicId',
  },
}