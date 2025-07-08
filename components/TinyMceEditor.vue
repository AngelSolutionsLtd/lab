<template>
  <div class="tiny-mc">
    <div class="tiny-mc__editor">
      <tinymce-editor
        ref="tinymce"
        v-model="internalValue"
        :id="editorId"
        :init="init"
        :apiKey="''"
        :licenseKey="'gpl'"
        @init="handleInit"
        @blur="() => $emit('onBlur')"
        @keyup="() => $emit('onKeyUp')"
        @change="() => $emit('onChange')"
        @focus="() => $emit('onFocus')"
      />
    </div>
  </div>
</template>

<script>
import 'tinymce';
import Editor from '@tinymce/tinymce-vue';
import '../Modules/TildaPlugin/tilda.js';

import 'tinymce/icons/default/icons.min.js';
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

import 'tinymce/plugins/advlist';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/fullscreen';

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
  mounted() {
    const container = this.$refs.tinymce.$el.querySelector('.tox');
    if (container) {
      container.addEventListener('tilda-clicked', (e) => {
        this.$emit('tilda-clicked', e.detail.editorId);
      });
    } else {
      console.warn('TinyMCE container not found for event binding');
    }
  },
  methods: {
    handleInit() {
      this.tinymceLoaded = true;
      this.internalValue = this.initialValue;
      this.$emit('onInit');
    },
  },
};
</script>
