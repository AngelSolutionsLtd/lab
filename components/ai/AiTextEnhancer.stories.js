import { ref } from 'vue';
import AiTextEnhancer from './AiTextEnhancer.vue';

export default {
  title: 'Components/AI/AI Text Enhancer',
  component: AiTextEnhancer,
  parameters: {
    docs: {
      description: {
        component: `
**AiTextEnhancer** wraps TiptapEditor with AI-powered text rewriting.

Highlight any text → click **Ask AI** in the floating bubble (or the ✨ toolbar button) →
pick an action. The selected text is replaced with the AI result, streamed in word by word.

**Integration contract**

Pass an \`aiHandler\` prop — a function with this signature:

\`\`\`js
// Option A — full response, typed out with animation
async function aiHandler(selectedText, action) {
  const result = await yourApi(selectedText, action.id);
  return result; // string
}

// Option B — real streaming (AsyncIterable<string>)
async function* aiHandler(selectedText, action) {
  for await (const chunk of yourStreamingApi(selectedText, action.id)) {
    yield chunk;
  }
}
\`\`\`

The component accepts the same props as **TiptapEditor** (\`height\`, \`editable\`,
\`placeholder\`, \`features\`) plus two AI-specific ones:

| Prop | Type | Description |
|---|---|---|
| \`aiHandler\` | \`Function\` | **Required.** See above. |
| \`actions\` | \`Array\` | Override the default action list. Each item: \`{ id, label, group }\`. Items sharing a \`group\` appear together with a divider between groups. |
        `,
      },
    },
  },
  argTypes: {
    height:   { control: 'number' },
    editable: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

// ─────────────────────────────────────────────────────────────────────
// Mock AI handler — simulates word-by-word streaming with a brief
// "thinking" delay. Swap this for your real API call in production.
// ─────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MOCK_RESPONSES = {
  improve:      'This has been thoughtfully revised to enhance clarity, flow, and overall readability while preserving the original intent and meaning of the content.',
  shorter:      'Revised for brevity and impact.',
  longer:       'This expanded version elaborates on the key points, providing additional context and nuance that gives the reader a more complete and thorough understanding of the subject matter.',
  grammar:      'The grammar and spelling have been carefully reviewed and corrected throughout this passage to ensure accuracy and professionalism.',
  simplify:     'This is now written in plain, simple language that anyone can easily understand.',
  professional: 'The content has been revised to reflect a polished, professional tone appropriate for formal business communications and executive audiences.',
  casual:       "We've rewritten this in a relaxed, conversational tone — the kind you'd use when chatting with a colleague over coffee.",
  friendly:     "We've given this a warm, approachable tone that's welcoming and easy to connect with — perfect for customer-facing content.",
  persuasive:   'This compelling rewrite uses persuasive language and a clear call to action, designed to engage your audience and motivate them to take the next step.',
  summarise:    'Key points distilled into a concise summary.',
};

async function* mockAiHandler(selectedText, action) {
  // Simulate network / model latency
  await sleep(600);

  const response = MOCK_RESPONSES[action.id]
    ?? `[${action.label}] ${selectedText}`;

  // Yield word by word to simulate streaming
  const words = response.split(' ');
  for (const word of words) {
    yield word + ' ';
    await sleep(45 + Math.random() * 35);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Shared template
// ─────────────────────────────────────────────────────────────────────
const SAMPLE = `
<h2>The quick brown fox</h2>
<p>Highlight any part of this text, then click <strong>Ask AI</strong> in the bubble that appears — or use the sparkle button in the toolbar. Pick an action and watch the selected text be replaced in real time.</p>
<p>You can try rewriting individual sentences, changing the tone of a paragraph, or asking the AI to make an entire section shorter or longer.</p>
<ul>
  <li>Select a single sentence and improve its clarity</li>
  <li>Highlight a paragraph and switch to a professional tone</li>
  <li>Select everything and ask for a concise summary</li>
</ul>
`.trim();

const Template = (args) => ({
  components: { AiTextEnhancer },
  setup() {
    const content = ref(args.modelValue ?? SAMPLE);
    return { args, content, mockAiHandler };
  },
  template: `
    <div style="max-width: 860px; margin: 24px auto; font-family: sans-serif;">
      <AiTextEnhancer
        v-bind="args"
        v-model="content"
        :ai-handler="mockAiHandler"
      />
      <details style="margin-top: 16px; font-size: 12px; color: #6b7280;">
        <summary style="cursor: pointer; user-select: none;">View HTML output</summary>
        <pre style="background:#f3f4f6; padding:12px; border-radius:4px; overflow:auto; margin-top:8px; font-size:11px;">{{ content }}</pre>
      </details>
    </div>
  `,
});

// ─────────────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────────────

/** Full editor with AI rewriting. Highlight text to trigger the AI bubble. */
export const Default = Template.bind({});
Default.args = {
  modelValue:  SAMPLE,
  height:      320,
  editable:    true,
  placeholder: 'Start writing…',
  features:    {},
};
Default.storyName = 'Default';

/** Demonstrates a custom reduced action list — useful for focused use-cases. */
export const CustomActions = (args) => ({
  components: { AiTextEnhancer },
  setup() {
    const content = ref(SAMPLE);
    const customActions = [
      { id: 'shorter',      label: 'Make shorter',      group: 'rewrite' },
      { id: 'longer',       label: 'Make longer',        group: 'rewrite' },
      { id: 'professional', label: 'Professional tone',  group: 'tone'    },
      { id: 'casual',       label: 'Casual tone',        group: 'tone'    },
    ];
    return { args, content, customActions, mockAiHandler };
  },
  template: `
    <div style="max-width: 860px; margin: 24px auto; font-family: sans-serif;">
      <p style="font-size:13px; color:#6b7280; margin-bottom:12px;">
        Custom action list — only length and tone options.
      </p>
      <AiTextEnhancer
        v-bind="args"
        v-model="content"
        :ai-handler="mockAiHandler"
        :actions="customActions"
      />
    </div>
  `,
});
CustomActions.args = { height: 300, editable: true, features: {} };
CustomActions.storyName = 'Custom action list';

/** No tables or fullscreen — lighter configuration for comment fields. */
export const Minimal = Template.bind({});
Minimal.args = {
  modelValue:  '<p>A short paragraph. Highlight this and try Ask AI.</p>',
  height:      180,
  editable:    true,
  placeholder: 'Write something…',
  features: {
    history:    true,
    formatting: true,
    headings:   false,
    alignment:  false,
    lists:      false,
    links:      false,
    tables:     false,
    fullscreen: false,
  },
};
Minimal.storyName = 'Minimal (no tables / headings)';
