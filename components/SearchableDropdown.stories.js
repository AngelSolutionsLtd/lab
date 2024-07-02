// .storybook/SearchableDropdown.stories.js

import SearchableDropdown from './SearchableDropdown.vue';

export default {
  title: 'Components/SearchableDropdown',
  component: SearchableDropdown,
  argTypes: {
    value: { control: 'object' }, // Adjust control based on your prop types
    options: { control: 'array' },
    groupOptions: { control: 'array' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    toggleLabel: { control: 'text' },
    togglePlaceholder: { control: 'text' },
    noOptions: { control: 'text' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
};

const Template = (args, { argTypes }) => ({
  components: { SearchableDropdown },
  props: Object.keys(argTypes),
  data() {
    return {
      localValue: this.value, // Create a local copy of the value prop
    }
  },
  template: `
    <div style="max-width: 300px">
      <SearchableDropdown 
        v-bind="$props" 
        v-model="localValue" 
        @input="handleInput">

          <template v-slot:optionGroupLabel="{ option }">
            <div v-if="option.icon" class="mr-1 required-badge d-inline-flex">
              <i :class="option.icon"></i>
            </div>
            {{ option.name }}
          </template>

      </SearchableDropdown>

    </div>
  `,
  methods: {
    handleInput(newValue) {
      this.localValue = newValue; // Update the local value
    }
  }
});

const defaultOptions = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
]

export const Default = Template.bind({});
Default.args = {
  options: defaultOptions,
  value: { id: 2, name: 'Option 2' }
};

export const WithOptionGroups = Template.bind({});
WithOptionGroups.argTypes = {
  ...Default.argTypes, // Inherit all argTypes from Default
  multiple: { control: 'boolean', table: { disable: true } }
};
WithOptionGroups.args = {
  options: [
    { id: 1, name: 'Option 1', optionGroup: true, optionGroupLabel: 'Group A' },
    { id: 2, name: 'Option 2', optionGroup: true, optionGroupLabel: 'Group A' },
    { id: 3, name: 'Option 3', optionGroup: true, optionGroupLabel: 'Group B' },
    { id: 4, name: 'Option 4', optionGroup: true, optionGroupLabel: 'Group B' },
  ],
  groupOptions: [
    { id: 5, name: 'Any Group', optionGroup: false },
    { id: 6, name: 'Even Options', optionGroup: false },
    { id: 7, name: 'Odd Options', optionGroup: false }
  ],
  hasOptionGroup: true,
  value: { id: 5, name: 'Any Group', optionGroup: false }
};

export const MultipleSelection = Template.bind({});
MultipleSelection.args = {
  options: defaultOptions,
  multiple: true,
  value: []
};

export const WithToggleOptions = Template.bind({});
WithToggleOptions.args = {
  appendToBody: false,
  canSearch: true,
  clearable: false,
  closeOnClick: true,
  disabled: false,
  groupOptions: [
    {
      affectsToggle: true,
      enableToggle: false,
      id: 1,
      name: 'Any active user',
      optionGroupLabel: 'Active Users',
    },
    {
      affectsToggle: true,
      enableToggle: true,
      id: 0,
      name: 'Any active or archived',
      optionGroupLabel: 'Any',
    },
    {
      affectsToggle: true,
      enableToggle: true,
      id: 2,
      name: 'Archived only',
      optionGroupLabel: 'Archived Users',
    },
  ],
  hasOptionGroup: true,
  hasToggledData: true,
  multiple: true,
  name: 'dropdown',
  noOptions: 'Sorry, no matching options.',
  optionGroupLabel: 'optionGroup',
  options: [
    { id: -1, name: 'Active Users', optionGroup: true, optionGroupLabel: 'Active Users' },
    { id: 'e2440d5b-621e-464f-aafe-c226bbb935bd', name: 'Alice Johnson', optionGroupLabel: 'Active Users' },
    { id: '62da961d-2699-49e5-851f-ede0442d3552', name: 'Bob Smith', optionGroupLabel: 'Active Users' },
    { id: 'fdc6f18a-1085-44b8-b232-4c3c8ad04882', name: 'Charlie Brown', optionGroupLabel: 'Active Users' },
    { id:-2, name:"Archived Users", optionGroupLabel:"Archived Users", optionGroup:true, archived:true},
    { id: 'b8718146-a03e-4434-bb7f-f4750725b04d', name: 'Lily Parker', archived: true, optionGroupLabel: 'Archived Users' },
    { id: 'b74a3459-9301-44f7-8d2f-50c7ea4ab818', name: 'Max Roberts', archived: true, optionGroupLabel: 'Archived Users' },
    { id: 'ba077c8b-d029-454c-a77e-844d4daa8b31', name: 'Noah Scott', archived: true, optionGroupLabel: 'Archived Users' }
  ],
  placeholder: 'Any user',
  searchPlaceholder: 'Search for a user',
  searchProperties: ['name'],
  selectedOptionLabel: 'user',
  toggleLabel: 'archived',
  togglePlaceholder: 'Include archived users',
  value: []
};

export const WithGroupIcon = Template.bind({});
WithGroupIcon.args = {
  options: [
    { id: 1, name: 'Required Standards', optionGroup: true, icon: 'entypo--shield entypo--shield--pink' },
    { id: 2, name: 'Standard 1', description: 'Description 1', recordId: '1' },
    { id: 3, name: 'Standard 2', description: 'Description 2', recordId: '2' },
    { id: 4, name: 'Optional Standards', optionGroup: true },
    { id: 5, name: 'Standard 3', description: 'Description 3', recordId: '3', optional: true },
    { id: 6, name: 'Standard 4', description: 'Description 4', recordId: '4', optional: true },
  ],
  searchPlaceholder: "Search for a template",
  placeholder:"Choose template`",
	togglePlaceholder:"Include optional templates",
	hasToggledData:false,
	toggleLabel:"optional",
	hasOptionGroup:true,
	optionGroupLabel:"optionGroup",
	hasIcon:"true",
  value: { id: 2, name: 'Standard 1', description: 'Description 1', recordId: '1' },
};