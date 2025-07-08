<template>
  <div class="tiny-mc">
    <div class="tiny-mc__editor">
      <tinymce-editor
        ref="tinymce"
        @init="handleInit"
        @blur="handleBlur"
        @keyup="handleKeyUp"
        @change="handleChange"
        @focus="handleFocus"
        v-model="internalValue"
        :id="editorId"
        :init="init"
        :apiKey="''"
        :licenseKey="'gpl'"
      />
    </div>
  </div>
</template>

<script>
import 'tinymce';
import { nextTick } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import '../Modules/TildaPlugin/tilda.js'

// ✅ Import TinyMCE theme, icons, model
import 'tinymce/icons/default/icons.min.js';
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

// ✅ Import TinyMCE plugins used
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/fullscreen';

// ✅ Import required TinyMCE CSS skins for themes to render correctly
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/content/default/content.min.css';

export default {
  name: 'TinyMceEditor',
  components: {
    'tinymce-editor': Editor,
  },
  props: {
    initialValue: {
      type: String,
      default: '',
    },
    init: {
      type: Object,
      required: true,
    },
    editorId: {
      type: String,
      required: false,
    },
    tmcClassBtn: {
      type: String,
      default: '',
    },
    settings: {
      type: Object,
    },
  },
  data() {
    return {
      internalValue: this.initialValue,
      tinymceLoaded: false,
    };
  },
  watch: {
    internalValue(newVal) {
      this.$emit('update:modelValue', newVal);
    },
  },
  methods: {
    handleInit() {
      this.tinymceLoaded = true;
      this.internalValue = this.initialValue;
      this.$emit('onInit');
    },
    handleBlur() {
      this.$emit('onBlur');
    },
    handleKeyUp() {
      this.$emit('onKeyUp');
    },
    handleChange() {
      this.$emit('onChange');
    },
    handleFocus() {
      this.$emit('onFocus');
    },
  },
};
</script>
