<template>
    <div 
      v-if="options"
      ref="toggle"
      :id="`searchable-dropdown-${dropdownId}`"
      class="searchable-dropdown"
      :class="{
        'searchable-dropdown--open' : optionsShown, 
        'searchable-dropdown--multiple' : multiple,
        'searchable-dropdown--disabled' : disabled
      }" 
      v-click-outside="onClickOutside"
    >
      <!-- Dropdown Input -->
      <div class="searchable-dropdown__trigger" @click.prevent="toggleDropdown">
  
        <!-- Selected Option -->
        <div class="searchable-dropdown__selected">
           <span v-if="value && multiple && Array.isArray(value) && value.length == 1">
            {{ value[0].name }}
          </span>
          <span v-else-if="value && multiple && Array.isArray(value) && value.length > 1">
            {{ selectedItemsCount }} <template v-if="selectedOptionLabel && selectedOptionLabel.length">{{ selectedOptionLabel }}{{ selectedItemsCount > 1 ? 's' : '' }}</template> selected
          </span>
          <span v-else-if="value && !multiple">
            {{ value.hasOwnProperty('displayName') ? value.displayName : value.name }}
          </span>
          <span v-else>
            {{ placeholder }}
          </span>
        </div>
  
        <div 
              v-if="clearable && value"
             class="searchable-dropdown__cancel"
             @click="$emit('input', null)">
          <span class="entypo--cancel"></span>
        </div>
  
        <div 
            class="searchable-dropdown__indicator"
            :class="{'searchable-dropdown__indicator--open': optionsShown}">
          <span class="entypo--down-dir" />
        </div>
  
      </div>
  
      <!-- Dropdown Menu -->
      <transition name="dropdown__fade">
        <div v-append-to-body class="searchable-dropdown__content" v-if="optionsShown">
          <div class="searchable-dropdown__header">
  
            
            <div v-if="groupOptions && groupOptions.length" class="searchable-dropdown__group-list">
                <div 
                  v-for="(option, index) in groupOptions"
                  class="searchable-dropdown__item"
                  :class="{
                    'searchable-dropdown__item--selected': isOptionSelected(option),
                  }"
                  :key="index"
                  @mousedown="selectOption(option)"
                >
                  {{option.name}}
                </div>
            </div>
  
            <div class="searchable-dropdown__search" v-if="canSearch">
              <input ref="searchInput" type="text" v-model="searchFilter" v-on:keyup="filterSearch" :placeholder="searchPlaceholder">
              <transition name="fade-300">
                <span v-if="searchFilter.length > 0" class="entypo--cancel" @click="clearSearch"></span>
              </transition>
            </div>
  
            <div v-if="hasToggledData && toggleLabel" class="searchable-dropdown__toggle-container">
              <div class="searchable-dropdown__toggle">
                <input :id="dropdownId" type="checkbox" v-model="toggleData">
                <label :for="dropdownId" />
              </div>
              <span @click.prevent="toggleData = !toggleData">{{togglePlaceholder}}</span>
            </div>
          </div>
  
          <div v-if="filteredOptions.length > 0" class="searchable-dropdown__list">
            <div 
              v-for="(option, index) in filteredOptions"
              :key="index" 
            >
              <div v-if="hasOptionGroup && option[optionGroupLabel]" class="searchable-dropdown__list-group">
                <checkbox v-if="multiple" small :value="isOptionSelected(option)" @input="selectOption(option)">
                  <strong>{{option.name}}</strong>
                </checkbox>
                <strong v-else>
                  {{ option.name }}
                </strong>
                
                <div v-if="option[optionGroupLabel] && !hasOptionsInGroup(option.optionGroupLabel)" class="p-1">No {{option.name}} data</div>
              </div> 
              <div 
                v-else-if="multiple"
                class="searchable-dropdown__item"
                :class="{
                   'searchable-dropdown__item--selected': isOptionSelected(option),
                   }"
              >
                <checkbox small :value="isOptionSelected(option)" @input="selectOption(option)">
                  <slot name="option" :option="option">{{ option.name }}</slot>
                </checkbox>
              </div>
              <div
                v-else
                class="searchable-dropdown__item"
                :class="{
                  'searchable-dropdown__item--selected': isOptionSelected(option),
                }"
                @mousedown="selectOption(option)"
              >
                {{ option.name || option.id || '-' }}
              </div>
            </div>
          </div>
          <div v-else class="searchable-dropdown__no-options">
            {{noOptions}}
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import vClickOutside from 'v-click-outside';
  import _ from 'lodash';
  import appendToBody from '../Modules/Helpers/appendToBody';
  import checkbox from './Checkbox'
  
    export default {
      name: 'SearchableDropdown',
      template: 'Dropdown',
      directives: { 
        appendToBody,
        'click-outside': vClickOutside.directive
      },
      components: {checkbox},
      props: {
        name: {
          type: String,
          required: false,
          default: 'dropdown',
          note: 'Input name'
        },
        multiple: {
          type: Boolean,
          required: false,
          default: false
        },
        options: {
          type: Array,
          required: true,
          default: () => [],
          note: 'Options of dropdown. An array of options with id and name',
        },
        groupOptions: {
          type: Array,
          required: false,
          default: () => [],
          note: 'Array of group options',
        },
        placeholder: {
          type: String,
          required: false,
          default: 'Please select an option'
        },
        searchPlaceholder: {
          type: String,
          required: false,
          default: 'Search an option'
        },
        canSearch: {
          type: Boolean,
          default: true
        },
        hasToggledData: {
          type: Boolean,
          required: false,
          default: false
        },
        selectedOptionLabel: {
          type: String,
          required: false,
          default: 'Option'
        },
        toggleLabel: {
          type: String,
          required: false
        },
        togglePlaceholder: {
          type: String,
          required: false,
          default: 'Toggle'
        },
        hasOptionGroup: {
          type: Boolean,
          required: false,
          default: false
        },
        optionGroupLabel: {
          type: String,
          required: false,
          default: ''
        },
        noOptions: {
          type: String,
          required: false,
          default: 'Sorry, no matching options.'
        },    
        disabled: {
          type: Boolean,
          required: false,
          default: false,
          note: 'Disable the dropdown'
        },
        value: {
          type: [Array, Number, String, Object],
          required: false
        },      
        appendToBody: {
          type: Boolean,
          default: false,
        },      
        calculatePosition: {
          type: Function,
          default(dropdownList, component, { width, top, left }) {
            dropdownList.style.top = top
            dropdownList.style.left = left
            dropdownList.style.width = width
          },
        },
        closeOnClick: {
          type: Boolean,
          default: true,
        },
        clearable: {
          type: Boolean,
          default: false
        },
        searchProperties: {
          type: Array,
          default: () => ['name']
        }      
      },
      data() {
        return {
          optionsShown: false,
          searchFilter: '',
          toggleData: false,
          filteredOptions: []
        }
      },
      computed: {
        dropdownId() {
          return _.uniqueId()
        },
        selectedItemsCount() {
          return this.multiple
            ? this.value.filter(v => !v.hasOwnProperty('optionGroup') && !v.optionGroup && !this.groupOptions.some(o => o.id === v.id)).length
            : 0;
        }
      },
      methods: {
        focusInput() {
          const searchInputRef = this.$refs.searchInput;
          if (searchInputRef) {
            searchInputRef.focus()
          }
        },
        hasOptionsInGroup(optionGroupLabel) {
          return this.filteredOptions && this.filteredOptions.some(o => !o.optionGroup && o.optionGroupLabel === optionGroupLabel);
        },
        selectOption(option) {
          const isTopGroupOption = this.groupOptions.some(o => o.id === option.id);
          // check if multiple and isn't a top group option 
          if (this.multiple && !isTopGroupOption) {
            let updatedValue;
            // check if option is a option group
            if (option.hasOwnProperty('optionGroup') && option.optionGroup) {
              // check if option is already selected
              if (this.checkIdInArray(this.value, option.id)) {
                // remove option if exists in value
                if(this.searchFilter.length > 0 && this.filteredOptions.length > 1) {
                  updatedValue = this.value.filter((item1) => !this.filteredOptions.some((item2) => item1.id === item2.id))
                } else {
                  updatedValue = this.removeItemsFromArray(this.value, 'optionGroupLabel', option.name);
                }
              } else {
                // filter options to match option group name
                const filteredOptions = this.filterArray(this.filteredOptions, 'optionGroupLabel', option.name);
                // merge filtered array options with current value and remove duplicates
                updatedValue = _.union(this.value, filteredOptions);
              }
            } else {
              // check if current value is an array
              if (Array.isArray(this.value)) {
              // check if option is already selected  
                if (this.checkIdInArray(this.value, option.id)) {
                  if (option.hasOwnProperty('optionGroupLabel') && option.optionGroupLabel) {
                    // remove option group from our current value
                    let removedGroupParent = this.value.filter(item => !item['optionGroup'] && item['optionGroupLabel'] === option.optionGroupLabel || item['optionGroupLabel'] !== option.optionGroupLabel);
                    // remove items under the option group as well
                    updatedValue = this.removeItemsFromArray(removedGroupParent, 'id', option.id);
                  } else {
                    // remove option if exists in value
                    updatedValue = this.removeItemsFromArray(this.value, 'id', option.id);
                  }
                } else {
                  // option not selected
                  updatedValue = [...this.value, option];
                  if (option.hasOwnProperty('optionGroupLabel') && option.optionGroupLabel) {
                    const allChildrenSelected = this.filteredOptions
                      .filter(o => !o.optionGroup && o.hasOwnProperty('optionGroupLabel') && o.optionGroupLabel === option.optionGroupLabel)
                      .every(o => updatedValue.some(v => v.id === o.id));
                    if (allChildrenSelected) {
                      // add parent to our current value
                      const parent = this.options.find(item => item['optionGroup'] && item['optionGroupLabel'] === option.optionGroupLabel);
                      if (parent) updatedValue = [...updatedValue, parent];
                    }
                  }
                }
              } else {
                // update value with the option as an array
                updatedValue = [option];
              }
            }
  
            // if individual option is clicked any top level group option is removed
              updatedValue = updatedValue.filter(obj => !this.groupOptions.some(o => o.id === obj.id))
  
            this.$emit("input", updatedValue);
          } 
          // checking if multiple is selected and a top level option group has been clicked
          else if (this.multiple && isTopGroupOption) {
            let updatedValue;
            this.toggleData = option.enableToggle
  
          // checking if the top level group option has a target group and it's 'Any' option
            if (option.hasOwnProperty('optionGroupLabel') && option.optionGroupLabel !== 'Any') {
              updatedValue = [
                ...this.filterArray(this.options, 'optionGroupLabel', option.optionGroupLabel),
                option
              ];
            } else {    
              this.toggleData = option.enableToggle
              updatedValue = [
                ...this.options,
                option
              ];
            }
            // close on click setting
            this.optionsShown = false;
            this.$emit("input", updatedValue);
          } else {
            this.optionsShown = false;
            this.$emit("input", option);
          }
        },
        checkIdInArray(arr, id) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
              return true;
            }
          }
          return false;
        },
        filterArray(arr, property, value) {
          return arr.filter(item => item[property] === value);
        },
        removeItemsFromArray(arr, property, value) {
          return arr.filter(item => item[property] !== value);
        },
        toggleDropdown(){
          if (!this.disabled) {
            this.optionsShown = !this.optionsShown;
            this.$nextTick(() => {
              this.focusInput();
            });
          }
        },
        isOptionSelected(option) {
          if(this.value) {
            if(this.multiple && Array.isArray(this.value) ) {
              let matchFound = false;
              if (option.hasOwnProperty('optionGroup') && option.optionGroup) {
                matchFound = this.filteredOptions
                  .filter(o => o.id !== option.id && o.hasOwnProperty('optionGroupLabel') && o.optionGroupLabel === option.optionGroupLabel)
                  .every(o => this.value.some(v => v.id === o.id));
              }
              else {
                this.value.forEach(obj => {
                  if (obj.id === option.id) {
                    matchFound = true;
                  }
                })
              }
              return matchFound
            } else {
              return this.value.id === option.id
            }
          } 
        },
        clearSearch() {
          this.searchFilter = '';
          this.filterSearch();
          this.focusInput();
        },
        onClickOutside(event) {
          const target = event.target;
          const clickInsideDropdown =
            target.path &&
            target.path.some((element) =>
              element.id && element.id.length > 0
                ? element.id.includes(`searchable-dropdown-${this.dropdownId}`)
                : false
            );
  
          const clickInsideOption = target.closest('.searchable-dropdown__item') !== null;
        
          const clickInsideSearchInput = target.closest('.searchable-dropdown__search input') !== null; 
          const clickInsideClearSearch = target.closest('.searchable-dropdown__search span') !== null; 
  
          if(this.optionsShown && !clickInsideDropdown && !clickInsideOption && !clickInsideSearchInput && !clickInsideClearSearch) {
            this.optionsShown = false
          }
        },
        filterSearch: _.debounce(function () {
          if (this.hasToggledData && this.toggleLabel) {
            this.archivedData()
          } else {
            this.filteredOptions = this.includeGroupLabelsToFilteredResult(
              this.options.filter(option => {
                // Check if any search property matches the search filter
                return this.searchProperties.some(property => {
                  if (option[property]) {
                    if (Array.isArray(option[property])) {
                      // If the property is an array, search against each item in the array
                      return option[property].some(item => item.toLowerCase().includes(this.searchFilter.toLowerCase()));
                    } else {
                      // If the property is a string, perform a simple string search
                      return option[property].toLowerCase().includes(this.searchFilter.toLowerCase());
                    }
                  }
                  return false;
                });
              })
            );
          }
        }, 200),
        archivedData() {
          // check if toggledData and label prop exists
          if(this.hasToggledData && this.toggleLabel) {
            const self = this;
            // filters data based on toggleLabel and bool set
            const options = this.options.filter(function (obj) {
              if (self.toggleData) {
                return self.searchFilter.length === 0 ? obj : obj.name.toLowerCase().includes(self.searchFilter.toLowerCase())
              } else {
                return !obj.hasOwnProperty(self.toggleLabel) && (self.searchFilter.length === 0 || obj.name.toLowerCase().includes(self.searchFilter.toLowerCase()))
              }
            });
            this.filteredOptions = this.searchFilter.length ? this.includeGroupLabelsToFilteredResult(options) : options;
          }
        },
        includeGroupLabelsToFilteredResult(options) {
          if (!options) return [];
          if (options && options.length === 1) return options;
  
          const groupLabels = [...new Set(options.map(o => o.optionGroupLabel))]
          const result = this.options.filter(option => options.some(o => o.id === option.id) || option.optionGroup && groupLabels.includes(option.optionGroupLabel));
          return result;
        }
      },
      created() {
        this.filteredOptions = this.options
        this.archivedData()
        this.toggleData = !this.multiple && this.value && (this.value.hasOwnProperty('affectsToggle') && this.value.affectsToggle && this.value.enableToggle || this.value[this.toggleLabel]);
      },    
      watch: {
        options() {
          this.filteredOptions = this.options;
        },
        toggleData(value) {
          this.archivedData()
          if(!value && this.value !== null) {
            if (Array.isArray(this.value)) {
              this.$emit("input", this.filterArray(this.value, this.toggleLabel))
            }
          }
        },
        value(value) {
          if(!this.multiple) {
            if (this.hasToggledData && this.toggleLabel) {
              this.archivedData()
              if (value && value.hasOwnProperty('affectsToggle') && value.affectsToggle) {
                this.toggleData = value.enableToggle;
              }
            }
          }
  
        },
      }
    };
  </script>
  