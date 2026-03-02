<template>
  <div class="aite-root">

    <!-- ── Fixed tooltip for bubble buttons (same trick as table bubble) -->
    <div
      v-if="bubbleTip.visible"
      class="tiptap__bubble-tip"
      :style="{ left: bubbleTip.x + 'px', top: bubbleTip.y + 'px' }"
    >{{ bubbleTip.text }}</div>

    <!-- ── AI selection bubble ───────────────────────────────────────── -->
    <BubbleMenu
      v-if="capturedEditor"
      :editor="capturedEditor"
      :tippy-options="{ theme: 'tiptap-bubble', placement: 'top', offset: [0, 8], zIndex: 60 }"
      :should-show="shouldShowBubble"
      class="tiptap__link-bubble aite__bubble"
    >
      <!-- Collapsed trigger -->
      <template v-if="!showBubbleActions">
        <button class="aite__bubble-trigger" @mousedown.prevent="showBubbleActions = true">
          <i class="entypo--twinkle aite__gradient-icon" aria-hidden="true" />
          Ask AI
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </template>

      <!-- Expanded action list -->
      <template v-else>
        <div class="aite__action-list">
          <template v-for="(group, gi) in groupedActions" :key="gi">
            <div v-if="gi > 0" class="aite__action-sep" />
            <button
              v-for="action in group"
              :key="action.id"
              class="aite__action-item"
              @mousedown.prevent="runAction(action)"
            >{{ action.label }}</button>
          </template>
        </div>
      </template>
    </BubbleMenu>

    <!-- ── TiptapEditor with AI toolbar button injected ─────────────── -->
    <div class="aite__editor-wrap" :class="{ 'aite__editor-wrap--processing': isProcessing }">
      <TiptapEditor
        v-model="internalValue"
        :height="height"
        :editable="editable"
        :placeholder="placeholder"
        :features="features"
        @on-ready="capturedEditor = $event"
        @on-focus="$emit('onFocus')"
        @on-blur="$emit('onBlur')"
        @on-change="$emit('onChange')"
      >
        <template #toolbar-actions>
          <div class="aite__toolbar-wrap tiptap__dropdown-wrap">
            <button
              class="tiptap__btn aite__toolbar-btn"
              :class="{ 'aite__toolbar-btn--on': showToolbarMenu || isProcessing }"
              :disabled="isProcessing"
              @mouseenter="showBubbleTip($event, 'AI rewrite')"
              @mouseleave="hideBubbleTip"
              @mousedown.prevent="showToolbarMenu = !showToolbarMenu; showBubbleActions = false"
            >
              <template v-if="isProcessing">
                <svg class="aite__spin aite__gradient-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              </template>
              <template v-else>
                <i class="entypo--twinkle aite__gradient-icon" aria-hidden="true" />
              </template>
            </button>

            <!-- Toolbar dropdown -->
            <template v-if="showToolbarMenu">
              <div class="tiptap__picker-backdrop" @mousedown.prevent="showToolbarMenu = false" />
              <div class="tiptap__dropdown aite__toolbar-dropdown">
                <template v-for="(group, gi) in groupedActions" :key="gi">
                  <div v-if="gi > 0" style="height:1px; background:#f0f0f0; margin: 3px 0;" />
                  <button
                    v-for="action in group"
                    :key="action.id"
                    class="tiptap__dropdown-item"
                    @mousedown.prevent="runActionFromToolbar(action)"
                  >
                    {{ action.label }}
                  </button>
                </template>
              </div>
            </template>
          </div>
        </template>
      </TiptapEditor>

      <!-- Processing shimmer overlay on content area only — toolbar stays interactive -->
      <div v-if="isProcessing" class="aite__processing-overlay" />
      <div v-if="isProcessing" class="aite__processing-bar" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { BubbleMenu } from '@tiptap/vue-3';
import TiptapEditor from '../editors/TiptapEditor.vue';

const DEFAULT_ACTIONS = [
  { id: 'improve',      label: 'Improve writing',    group: 'rewrite' },
  { id: 'shorter',      label: 'Make shorter',        group: 'rewrite' },
  { id: 'longer',       label: 'Make longer',         group: 'rewrite' },
  { id: 'grammar',      label: 'Fix grammar',         group: 'rewrite' },
  { id: 'simplify',     label: 'Simplify language',   group: 'rewrite' },
  { id: 'professional', label: 'Professional tone',   group: 'tone' },
  { id: 'casual',       label: 'Casual tone',         group: 'tone' },
  { id: 'friendly',     label: 'Friendly tone',       group: 'tone' },
  { id: 'persuasive',   label: 'Persuasive tone',     group: 'tone' },
  { id: 'summarise',    label: 'Summarise',           group: 'other' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isAsyncIterable = (val) =>
  val != null && typeof val === 'object' && typeof val[Symbol.asyncIterator] === 'function';

export default {
  name: 'AiTextEnhancer',
  components: { TiptapEditor, BubbleMenu },

  props: {
    modelValue:  { type: String,   default: '' },
    height:      { type: Number,   default: 280 },
    editable:    { type: Boolean,  default: true },
    placeholder: { type: String,   default: '' },
    features:    { type: Object,   default: () => ({}) },
    aiHandler:   { type: Function, required: true },
    actions:     { type: Array,    default: () => DEFAULT_ACTIONS },
  },

  emits: ['update:modelValue', 'onChange', 'onFocus', 'onBlur'],

  setup(props, { emit }) {
    const capturedEditor    = ref(null);
    const isProcessing      = ref(false);
    const showBubbleActions = ref(false);
    const showToolbarMenu   = ref(false);
    const bubbleTip         = ref({ visible: false, text: '', x: 0, y: 0 });

    const internalValue = computed({
      get: () => props.modelValue,
      set: (v) => emit('update:modelValue', v),
    });

    const groupedActions = computed(() => {
      const groups = [];
      const seen = new Map();
      for (const action of props.actions) {
        const g = action.group ?? 'other';
        if (!seen.has(g)) { seen.set(g, []); groups.push(seen.get(g)); }
        seen.get(g).push(action);
      }
      return groups;
    });

    const shouldShowBubble = ({ state }) => {
      if (isProcessing.value) return false;
      const { from, to } = state.selection;
      const hasSelection = from !== to;
      if (!hasSelection) showBubbleActions.value = false;
      return hasSelection;
    };

    const runAction = async (action) => {
      const editor = capturedEditor.value;
      if (!editor) return;

      const { from, to } = editor.state.selection;
      if (from === to) return;

      const selectedText = editor.state.doc.textBetween(from, to, ' ');

      showBubbleActions.value = false;
      showToolbarMenu.value   = false;
      isProcessing.value      = true;

      editor.chain().focus().deleteRange({ from, to }).run();
      let pos = from;

      try {
        const result = props.aiHandler(selectedText, action);

        if (isAsyncIterable(result)) {
          for await (const chunk of result) {
            editor.commands.insertContentAt(pos, chunk);
            pos += chunk.length;
          }
        } else {
          const text = await result;
          for (const char of text) {
            await sleep(8 + Math.random() * 18);
            editor.commands.insertContentAt(pos, char);
            pos++;
          }
        }
      } catch (err) {
        console.error('[AiTextEnhancer] handler error:', err);
        editor.commands.insertContentAt(from, selectedText);
      } finally {
        isProcessing.value = false;
      }
    };

    const runActionFromToolbar = (action) => {
      showToolbarMenu.value = false;
      const editor = capturedEditor.value;
      if (!editor) return;
      const { from, to } = editor.state.selection;
      if (from === to) editor.commands.selectAll();
      runAction(action);
    };

    const showBubbleTip = (e, text) => {
      const r = e.currentTarget.getBoundingClientRect();
      bubbleTip.value = { visible: true, text, x: r.left + r.width / 2, y: r.top - 6 };
    };
    const hideBubbleTip = () => { bubbleTip.value = { ...bubbleTip.value, visible: false }; };

    return {
      capturedEditor, internalValue, isProcessing,
      showBubbleActions, showToolbarMenu,
      groupedActions, shouldShowBubble,
      bubbleTip, showBubbleTip, hideBubbleTip,
      runAction, runActionFromToolbar,
    };
  },
};
</script>

<style>
/* ── Root wrapper ──────────────────────────────────────────────────── */
.aite-root {
  position: relative;
  --aite-gradient: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%);
}

/* ── Editor wrap ───────────────────────────────────────────────────── */
.aite__editor-wrap { position: relative; }

/* Block content interaction while processing — toolbar stays usable */
.aite__processing-overlay {
  position: absolute;
  top: 46px; /* below toolbar */
  left: 0; right: 0; bottom: 0;
  z-index: 4;
  pointer-events: all;
  cursor: wait;
}

/* Animated gradient progress bar along the top of the editor */
.aite__processing-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: linear-gradient(90deg, transparent 0%, #40c9ff 35%, #e81cff 65%, transparent 100%);
  background-size: 200% 100%;
  animation: aite-progress 1.2s ease-in-out infinite;
  z-index: 5;
  pointer-events: none;
}
@keyframes aite-progress {
  0%   { background-position: 150% 0; }
  100% { background-position: -50% 0; }
}

/* ── Gradient icon utility ─────────────────────────────────────────── */
.aite__gradient-icon {
  background: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 15px;
  line-height: 1;
  display: block;
}

/* ── Bubble container — gradient border ────────────────────────────── */
.aite__bubble {
  padding: 3px 6px;
  border: 1px solid transparent !important;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%) border-box !important;
  border-radius: 8px !important;
}

/* ── Bubble trigger button ─────────────────────────────────────────── */
.aite__bubble-trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px 3px 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  border-radius: 5px;
  transition: background 100ms;
  /* Gradient text for "Ask AI" label */
  background: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.aite__bubble-trigger svg { -webkit-text-fill-color: initial; }
.aite__bubble-trigger:hover { background: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }

/* ── Action list (inside bubble) ──────────────────────────────────── */
.aite__action-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 2px 0;
}

.aite__action-sep {
  height: 1px;
  background: #f0f0f0;
  margin: 3px 0;
}

.aite__action-item {
  display: block;
  width: 100%;
  padding: 5px 10px;
  background: none;
  border: none;
  border-radius: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  font-size: 12.5px;
  font-weight: 400;
  color: #374151;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  transition: background 80ms, color 80ms;
}
.aite__action-item:hover {
  background: #f5f0ff;
  color: #7c3aed;
}

/* ── Toolbar button ────────────────────────────────────────────────── */
.aite__toolbar-wrap { position: relative; }

.aite__toolbar-btn { color: #8c8c9a; }
.aite__toolbar-btn:hover:not(:disabled) { background: #f5f0ff; }
.aite__toolbar-btn--on { background: #f0ebff; }

/* Toolbar dropdown */
.aite__toolbar-dropdown {
  min-width: 170px;
  left: 0;
}

/* ── Spinner ───────────────────────────────────────────────────────── */
@keyframes aite-spin {
  to { transform: rotate(360deg); }
}
.aite__spin {
  animation: aite-spin 0.7s linear infinite;
  display: block;
}
</style>
