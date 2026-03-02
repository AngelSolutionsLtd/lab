<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="tilda-overlay">
      <div v-if="isOpen" class="tilda-overlay" @click="close" />
    </Transition>

    <!-- Drawer -->
    <Transition name="tilda-drawer">
      <div v-if="isOpen" class="tilda-drawer" role="dialog" aria-label="Tilda">

        <!-- Header -->
        <div class="tilda-header">
          <Transition name="tilda-back" mode="out-in">
            <button v-if="view === 'detail'" key="back" class="tilda-header__back" @click="goHome" aria-label="Back" type="button">
              <i class="entypo--left-open"></i>
            </button>
            <span v-else key="icon" class="tilda-header__icon">
              <i class="entypo--twinkle"></i>
            </span>
          </Transition>

          <div class="tilda-header__text">
            <div class="tilda-header__name">Tilda</div>
            <Transition name="tilda-fade" mode="out-in">
              <div v-if="view === 'home'" key="sub-home" class="tilda-header__sub">
                <span class="tilda-header__dot"></span> Analysing your data
              </div>
              <div v-else key="sub-detail" class="tilda-header__sub tilda-header__sub--context">
                {{ detailContext }}
              </div>
            </Transition>
          </div>

          <button class="tilda-header__close" @click="close" aria-label="Close" type="button">
            <i class="entypo--cancel"></i>
          </button>
        </div>

        <!-- Views -->
        <div class="tilda-views">
          <Transition :name="transitionName">

            <!-- Home view -->
            <div v-if="view === 'home'" key="home" class="tilda-view">
              <div class="tilda-view__body">
                <p class="tilda-label">What I'm seeing</p>

                <div class="tilda-cards">
                  <button
                    v-for="(insight, i) in insights"
                    :key="i"
                    class="tilda-card"
                    @click="openInsight(insight)"
                    type="button"
                  >
                    <div class="tilda-card__bar"></div>
                    <div class="tilda-card__content">
                      <div class="tilda-card__title">{{ insight.title }}</div>
                      <div class="tilda-card__preview">{{ insight.body }}</div>
                    </div>
                    <i class="entypo--right-open tilda-card__arrow"></i>
                  </button>
                </div>

                <template v-if="quickActions && quickActions.length">
                  <p class="tilda-label" style="margin-top: 22px;">Quick actions</p>
                  <div class="tilda-quick-actions">
                    <template v-for="(action, i) in quickActions" :key="i">
                      <!-- Idle -->
                      <button
                        v-if="!quickCompleted[i]"
                        class="tilda-action-chip"
                        @click="triggerQuickAction(i, action)"
                        type="button"
                      >
                        <i v-if="action.icon" :class="action.icon"></i>{{ action.label }}
                      </button>
                      <!-- Loading -->
                      <div v-else-if="quickCompleted[i] === 'loading'" class="tilda-action-chip tilda-action-chip--loading">
                        <span class="tilda-mini-dots"><span></span><span></span><span></span></span>
                        Preparing...
                      </div>
                      <!-- Ready -->
                      <a v-else-if="quickCompleted[i] === 'ready'" href="#" class="tilda-action-chip tilda-action-chip--ready" @click.prevent>
                        <i class="entypo--download"></i> {{ action.filename }}
                      </a>
                      <!-- Done (non-export) -->
                      <div v-else-if="quickCompleted[i] === 'done'" class="tilda-action-chip tilda-action-chip--done">
                        <i class="entypo--check"></i> Done
                      </div>
                    </template>
                  </div>
                </template>
              </div>

              <div class="tilda-view__footer">
                <div class="tilda-or">
                  <span>or ask something specific</span>
                </div>
                <div class="tilda-input-wrap" :class="{ 'is-focused': inputFocused }">
                  <input
                    v-model="inputText"
                    class="tilda-input"
                    type="text"
                    placeholder="Ask about your data..."
                    ref="inputEl"
                    @focus="inputFocused = true"
                    @blur="inputFocused = false"
                    @keydown.enter.prevent="askFromHome"
                  />
                  <button
                    class="tilda-send"
                    @click="askFromHome"
                    :disabled="!inputText.trim()"
                    type="button"
                    aria-label="Ask"
                  >
                    <i class="entypo--right-open"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Detail view -->
            <div v-else-if="view === 'detail'" key="detail" class="tilda-view">
              <div class="tilda-view__body" ref="detailBodyEl">

                <!-- Analysing state -->
                <Transition name="tilda-fade" mode="out-in">
                  <div v-if="isAnalysing" key="analysing" class="tilda-analysing">
                    <div class="tilda-analysing__dots">
                      <span></span><span></span><span></span>
                    </div>
                    <p class="tilda-analysing__label">Analysing your data</p>
                  </div>

                  <!-- Response -->
                  <div v-else-if="currentResponse" key="response" class="tilda-response">
                    <p class="tilda-response__summary">{{ currentResponse.summary }}</p>
                    <p v-if="currentResponse.body" class="tilda-response__body">{{ currentResponse.body }}</p>
                    <div v-if="currentResponse.stat" class="tilda-response__stat">
                      <span class="tilda-response__stat-value">{{ currentResponse.stat.value }}</span>
                      <span class="tilda-response__stat-label">{{ currentResponse.stat.label }}</span>
                    </div>
                    <ul v-if="currentResponse.points" class="tilda-response__points">
                      <li v-for="(point, i) in currentResponse.points" :key="i">{{ point }}</li>
                    </ul>
                    <div v-if="currentResponse.actions && currentResponse.actions.length" class="tilda-response__actions">
                      <template v-for="(action, i) in currentResponse.actions" :key="i">
                        <!-- Idle -->
                        <button
                          v-if="!completedActions[i]"
                          class="tilda-action-btn"
                          @click="triggerAction(i, action)"
                          type="button"
                        >
                          <i v-if="action.icon" :class="action.icon"></i>{{ action.label }}
                        </button>
                        <!-- Loading -->
                        <div v-else-if="completedActions[i] === 'loading'" class="tilda-action-export">
                          <span class="tilda-mini-dots"><span></span><span></span><span></span></span>
                          <span>Preparing export…</span>
                        </div>
                        <!-- Ready -->
                        <div v-else-if="completedActions[i] === 'ready'" class="tilda-action-export tilda-action-export--ready">
                          <span class="tilda-action-export__label"><i class="entypo--check"></i> Export ready</span>
                          <a href="#" class="tilda-action-export__download" @click.prevent>
                            <i class="entypo--attach"></i>
                            <span>{{ action.filename }}</span>
                            <span class="tilda-action-export__dl">Download</span>
                          </a>
                        </div>
                        <!-- Done (non-export) -->
                        <button v-else-if="completedActions[i] === 'done'" class="tilda-action-btn tilda-action-btn--done" disabled>
                          <i class="entypo--check"></i> Done
                        </button>
                      </template>
                    </div>
                  </div>
                </Transition>

              </div>

              <!-- Follow-up -->
              <div class="tilda-view__footer">
                <div class="tilda-input-wrap" :class="{ 'is-focused': followFocused }">
                  <input
                    v-model="followUpText"
                    class="tilda-input"
                    type="text"
                    placeholder="Dig deeper..."
                    ref="followUpEl"
                    :disabled="isAnalysing"
                    @focus="followFocused = true"
                    @blur="followFocused = false"
                    @keydown.enter.prevent="sendFollowUp"
                  />
                  <button
                    class="tilda-send"
                    @click="sendFollowUp"
                    :disabled="!followUpText.trim() || isAnalysing"
                    type="button"
                    aria-label="Ask"
                  >
                    <i class="entypo--right-open"></i>
                  </button>
                </div>
              </div>
            </div>

          </Transition>
        </div>

      </div>
    </Transition>

    <!-- Trigger -->
    <Transition name="tilda-trigger-anim">
      <button
        v-if="!isOpen"
        class="tilda-trigger"
        @click="open"
        type="button"
        aria-label="Open Tilda"
      >
        <i class="entypo--twinkle"></i>
        <span class="tilda-trigger__label">Tilda</span>
      </button>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import '../../fonts/style.css';

const props = defineProps({
  quickActions: {
    type: Array,
    default: () => [],
  },
  insights: {
    type: Array,
    default: () => [
      {
        title: 'Personal Development is your biggest gap',
        body: '40% complete — this section carries significant weight and should be your next focus.',
        response: {
          summary: 'Personal Development should be your immediate priority.',
          body: 'At 40% completion it\'s your lowest-scoring area, and it carries significant weight in the current inspection framework. Your other sections are strong enough to hold — this is where focused effort will have the most impact.',
          points: [
            'Extracurricular provision needs evidencing',
            'RSHE content is partially drafted — close to completion',
            'Careers guidance section is currently empty',
          ],
        },
      },
      {
        title: 'Behaviour & Attitudes is a strong foundation',
        body: '95% complete — well evidenced and uses the right framework language.',
        response: {
          summary: 'Your Behaviour & Attitudes section is in excellent shape.',
          body: 'At 95% completion this is your strongest area. The evidence is specific, the language aligns well with the 2025 framework, and the narrative is coherent. Use this section as a model for the others.',
          stat: { value: '95%', label: 'Section completion' },
          points: [
            'Pupil conduct and attitudes are well evidenced',
            'Attendance data is referenced and contextualised',
            'One minor gap: exclusions data needs a recent update',
          ],
        },
      },
      {
        title: '4 BSQs remain — a clear next step',
        body: 'All relate to staff development and curriculum sequencing.',
        response: {
          summary: 'Completing these 4 BSQs would unlock a full draft.',
          body: 'The remaining bite-sized questions all sit within staff development and curriculum sequencing — areas where you have strong practice but limited written evidence. Answering these prompts would give Tilda enough to generate a complete draft.',
          stat: { value: '8 / 12', label: 'BSQs completed' },
          points: [
            'Staff CPD and impact — 2 questions',
            'Curriculum sequencing rationale — 2 questions',
            'Estimated time to complete: under 20 minutes',
          ],
        },
      },
    ],
  },
});

const completedActions = ref({});
const quickCompleted = ref({});

const isOpen = ref(false);
const view = ref('home');
const transitionName = ref('tilda-slide-forward');
const isAnalysing = ref(false);
const inputText = ref('');
const followUpText = ref('');
const inputFocused = ref(false);
const followFocused = ref(false);
const detailContext = ref('');
const currentResponse = ref(null);
const inputEl = ref(null);
const followUpEl = ref(null);
const detailBodyEl = ref(null);

const mockResponses = [
  {
    summary: 'You\'re performing well overall but there\'s a clear priority.',
    body: 'Three sections are inspection-ready. The remaining work is concentrated in Personal Development — completing it would bring your overall readiness above 85%.',
    stat: { value: '74%', label: 'Overall SEF readiness' },
    points: [
      'Up 8% since last term',
      'Quality of Education needs one more evidence link',
      'Personal Development is your main outstanding area',
    ],
  },
  {
    summary: 'Ofsted will focus heavily on intent, implementation, and impact.',
    body: 'For each curriculum area they\'ll want to see what you\'re trying to achieve, how you\'re delivering it, and the difference it\'s making to pupils. Evidence should be specific and recent — avoid broad claims.',
    points: [
      'Link every claim to concrete, dated evidence',
      'Use the language of the 2025 inspection framework',
      'Tilda can help align your existing content to these criteria',
    ],
  },
  {
    summary: 'A few targeted actions would move the needle significantly.',
    body: 'Focus on Personal Development first, then use Tilda to generate a draft from your completed BSQs. From there it\'s mostly refinement rather than creation from scratch.',
    points: [
      'Complete the 4 remaining BSQs (est. 20 mins)',
      'Generate a Personal Development draft with Tilda',
      'Review and add evidence links across all sections',
    ],
  },
];

let mockIndex = 0;

const open = () => {
  isOpen.value = true;
  nextTick(() => inputEl.value?.focus());
};

const close = () => {
  isOpen.value = false;
};

const triggerAction = (i, action) => {
  if (action.type === 'export') {
    completedActions.value = { ...completedActions.value, [i]: 'loading' };
    setTimeout(() => {
      completedActions.value = { ...completedActions.value, [i]: 'ready' };
    }, 1800);
  } else {
    completedActions.value = { ...completedActions.value, [i]: 'done' };
    setTimeout(() => {
      const next = { ...completedActions.value };
      delete next[i];
      completedActions.value = next;
    }, 2000);
  }
};

const triggerQuickAction = (i, action) => {
  if (action.type === 'export') {
    quickCompleted.value = { ...quickCompleted.value, [i]: 'loading' };
    setTimeout(() => {
      quickCompleted.value = { ...quickCompleted.value, [i]: 'ready' };
    }, 1800);
  } else {
    quickCompleted.value = { ...quickCompleted.value, [i]: 'done' };
    setTimeout(() => {
      const next = { ...quickCompleted.value };
      delete next[i];
      quickCompleted.value = next;
    }, 2000);
  }
};

const goHome = () => {
  transitionName.value = 'tilda-slide-back';
  view.value = 'home';
  followUpText.value = '';
  currentResponse.value = null;
  completedActions.value = {};
};

const navigateToDetail = async (context, response) => {
  transitionName.value = 'tilda-slide-forward';
  detailContext.value = context;
  currentResponse.value = null;
  completedActions.value = {};
  view.value = 'detail';

  if (response) {
    isAnalysing.value = true;
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    isAnalysing.value = false;
    currentResponse.value = response;
  }

  nextTick(() => {
    followUpEl.value?.focus();
  });
};

const openInsight = (insight) => {
  navigateToDetail(insight.title, insight.response || mockResponses[mockIndex++ % mockResponses.length]);
};

const askFromHome = async () => {
  const text = inputText.value.trim();
  if (!text) return;
  inputText.value = '';
  await navigateToDetail(text, mockResponses[mockIndex++ % mockResponses.length]);
};

const sendFollowUp = async () => {
  const text = followUpText.value.trim();
  if (!text || isAnalysing.value) return;
  followUpText.value = '';
  detailContext.value = text;
  isAnalysing.value = true;
  currentResponse.value = null;
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
  isAnalysing.value = false;
  currentResponse.value = mockResponses[mockIndex++ % mockResponses.length];
  nextTick(() => {
    if (detailBodyEl.value) detailBodyEl.value.scrollTop = 0;
  });
};
</script>

<style scoped>
/* ── Overlay ── */
.tilda-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.22);
  z-index: 9990;
}

/* ── Drawer ── */
.tilda-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9991;
  width: 400px;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  background: #faf9fc;
  box-shadow: -4px 0 40px rgba(0, 0, 0, 0.1);
  font-family: 'Open Sans', sans-serif;
  overflow: hidden;
}

/* ── Header ── */
.tilda-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%);
  flex-shrink: 0;
}
.tilda-header__icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  color: #fff;
  flex-shrink: 0;
}
.tilda-header__back {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.tilda-header__back:hover { background: rgba(255, 255, 255, 0.32); }
.tilda-header__text { flex: 1; min-width: 0; }
.tilda-header__name {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
}
.tilda-header__sub {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  margin-top: 2px;
}
.tilda-header__sub--context {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 11.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.tilda-header__dot {
  width: 6px;
  height: 6px;
  background: #a8ffb0;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.tilda-header__close {
  background: rgba(255, 255, 255, 0.18);
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s;
  flex-shrink: 0;
}
.tilda-header__close:hover { background: rgba(255, 255, 255, 0.32); }

/* ── Views container ── */
.tilda-views {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Individual view ── */
.tilda-view {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}
.tilda-view__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 16px;
  scroll-behavior: smooth;
}
.tilda-view__footer {
  flex-shrink: 0;
  padding: 14px 20px 20px;
  background: #faf9fc;
  border-top: 1px solid #ede9f5;
}

/* ── Section label ── */
.tilda-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #b0a8c0;
  margin: 0 0 14px;
}

/* ── Insight cards ── */
.tilda-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tilda-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #ede9f5;
  border-radius: 10px;
  padding: 14px 14px 14px 0;
  text-align: left;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.tilda-card:hover {
  border-color: #c9b8f0;
  box-shadow: 0 2px 12px rgba(160, 100, 240, 0.1);
  transform: translateY(-1px);
}
.tilda-card:hover .tilda-card__arrow {
  opacity: 1;
  transform: translateX(2px);
}
.tilda-card__bar {
  width: 4px;
  min-height: 48px;
  align-self: stretch;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #40c9ff, #e81cff);
  flex-shrink: 0;
}
.tilda-card__content { flex: 1; min-width: 0; }
.tilda-card__title {
  font-size: 13px;
  font-weight: 600;
  color: #1e1a2e;
  margin-bottom: 3px;
  line-height: 1.4;
}
.tilda-card__preview {
  font-size: 12px;
  color: #8a82a0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tilda-card__arrow {
  font-size: 13px;
  color: #c0b4d8;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.15s, transform 0.15s;
  margin-right: 4px;
}

/* ── Home "or" divider ── */
.tilda-or {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #c0b4d8;
  font-size: 11px;
}
.tilda-or::before,
.tilda-or::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ede9f5;
}

/* ── Input ── */
.tilda-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #e0d6f5;
  border-radius: 10px;
  padding: 8px 8px 8px 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.tilda-input-wrap.is-focused {
  border-color: #c084fc;
  box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.12);
}
.tilda-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 13px;
  font-family: 'Open Sans', sans-serif;
  color: #1e1a2e;
  outline: none;
}
.tilda-input::placeholder { color: #c0b4d8; }
.tilda-input:disabled { opacity: 0.5; }
.tilda-send {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: none;
  background: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%);
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s, transform 0.15s;
}
.tilda-send:disabled { opacity: 0.28; cursor: default; }
.tilda-send:not(:disabled):hover { transform: scale(1.07); }

/* ── Analysing state ── */
.tilda-analysing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  padding: 40px 0;
}
.tilda-analysing__dots {
  display: flex;
  gap: 8px;
}
.tilda-analysing__dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #40c9ff, #e81cff);
  animation: tilda-dot 1.3s infinite ease-in-out both;
}
.tilda-analysing__dots span:nth-child(2) { animation-delay: 0.18s; }
.tilda-analysing__dots span:nth-child(3) { animation-delay: 0.36s; }
.tilda-analysing__label {
  font-size: 13px;
  color: #b0a8c0;
  font-style: italic;
  margin: 0;
}

@keyframes tilda-dot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
  40%            { transform: scale(1); opacity: 1; }
}

/* ── Response ── */
.tilda-response { padding: 4px 0; }
.tilda-response__summary {
  font-size: 16px;
  font-weight: 700;
  color: #1e1a2e;
  line-height: 1.45;
  margin: 0 0 14px;
}
.tilda-response__body {
  font-size: 13.5px;
  color: #5a5270;
  line-height: 1.7;
  margin: 0 0 18px;
}
.tilda-response__stat {
  display: inline-flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ede9f5;
  border-radius: 10px;
  padding: 12px 20px;
  margin-bottom: 18px;
}
.tilda-response__stat-value {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.tilda-response__stat-label {
  font-size: 11px;
  color: #a09ab8;
  margin-top: 3px;
}
.tilda-response__points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tilda-response__points li {
  font-size: 13px;
  color: #5a5270;
  line-height: 1.5;
  padding-left: 16px;
  position: relative;
}
.tilda-response__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #40c9ff, #e81cff);
}

/* ── Quick action chips (home view) ── */
.tilda-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tilda-action-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  border-radius: 20px;
  border: 1.5px solid #e0d6f5;
  background: #fff;
  color: #5a5270;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.tilda-action-chip:hover {
  border-color: #c084fc;
  background: #faf7ff;
  color: #1e1a2e;
}
.tilda-action-chip--done {
  border-color: #86efac;
  background: #f0fdf4;
  color: #16a34a;
  pointer-events: none;
}
.tilda-action-chip--loading {
  border-color: #e0d6f5;
  background: #faf7ff;
  color: #b0a8c0;
  pointer-events: none;
  gap: 7px;
}
.tilda-action-chip--ready {
  border-color: #86efac;
  background: #f0fdf4;
  color: #16a34a;
  text-decoration: none;
  font-weight: 600;
}
.tilda-action-chip--ready:hover {
  border-color: #4ade80;
  background: #dcfce7;
}

/* ── Mini dots (used in loading states) ── */
.tilda-mini-dots {
  display: inline-flex;
  gap: 3px;
  align-items: center;
}
.tilda-mini-dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #40c9ff, #e81cff);
  animation: tilda-dot 1.3s infinite ease-in-out both;
}
.tilda-mini-dots span:nth-child(2) { animation-delay: 0.18s; }
.tilda-mini-dots span:nth-child(3) { animation-delay: 0.36s; }

/* ── Export loading / ready (response actions) ── */
.tilda-action-export {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-radius: 8px;
  border: 1.5px solid #e0d6f5;
  background: #faf7ff;
  color: #b0a8c0;
  font-size: 13px;
  font-family: 'Open Sans', sans-serif;
}
.tilda-action-export--ready {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-color: #86efac;
  background: #f0fdf4;
}
.tilda-action-export__label {
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
  display: flex;
  align-items: center;
  gap: 5px;
}
.tilda-action-export__download {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #bbf7d0;
  color: #15803d;
  font-size: 12.5px;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  text-decoration: none;
  width: 100%;
  transition: background 0.15s, border-color 0.15s;
}
.tilda-action-export__download:hover {
  background: #dcfce7;
  border-color: #4ade80;
}
.tilda-action-export__dl {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Response action buttons (detail view) ── */
.tilda-response__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}
.tilda-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 9px 16px;
  border-radius: 8px;
  border: 1.5px solid #e0d6f5;
  background: #fff;
  color: #5a5270;
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.tilda-action-btn:hover {
  border-color: #c084fc;
  background: #faf7ff;
  color: #1e1a2e;
}
.tilda-action-btn--done {
  border-color: #86efac;
  background: #f0fdf4;
  color: #16a34a;
  pointer-events: none;
}

/* ── Trigger ── */
.tilda-trigger {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9992;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 0 16px;
  height: 48px;
  border: none;
  border-radius: 24px;
  background: linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%);
  color: #fff;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(200, 60, 255, 0.38), 0 2px 6px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.tilda-trigger:hover {
  box-shadow: 0 6px 24px rgba(200, 60, 255, 0.5), 0 3px 8px rgba(0,0,0,0.14);
  transform: translateY(-1px);
}
.tilda-trigger i { font-size: 19px; }
.tilda-trigger__label { letter-spacing: 0.1px; }

/* ── Transitions ── */
.tilda-drawer-enter-active {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.tilda-drawer-leave-active {
  transition: transform 0.22s ease-in;
}
.tilda-drawer-enter-from,
.tilda-drawer-leave-to { transform: translateX(100%); }

.tilda-overlay-enter-active,
.tilda-overlay-leave-active { transition: opacity 0.25s ease; }
.tilda-overlay-enter-from,
.tilda-overlay-leave-to { opacity: 0; }

/* Forward: slide left */
.tilda-slide-forward-enter-active,
.tilda-slide-forward-leave-active { transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease; }
.tilda-slide-forward-enter-from { transform: translateX(30px); opacity: 0; }
.tilda-slide-forward-leave-to   { transform: translateX(-30px); opacity: 0; }

/* Back: slide right */
.tilda-slide-back-enter-active,
.tilda-slide-back-leave-active { transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease; }
.tilda-slide-back-enter-from { transform: translateX(-30px); opacity: 0; }
.tilda-slide-back-leave-to   { transform: translateX(30px); opacity: 0; }

.tilda-fade-enter-active,
.tilda-fade-leave-active { transition: opacity 0.2s ease; }
.tilda-fade-enter-from,
.tilda-fade-leave-to { opacity: 0; }

.tilda-back-enter-active,
.tilda-back-leave-active { transition: opacity 0.15s, transform 0.15s; }
.tilda-back-enter-from { opacity: 0; transform: scale(0.8); }
.tilda-back-leave-to   { opacity: 0; transform: scale(0.8); }

.tilda-trigger-anim-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tilda-trigger-anim-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tilda-trigger-anim-enter-from,
.tilda-trigger-anim-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.92);
}
</style>
