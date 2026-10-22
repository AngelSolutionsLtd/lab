export default {
  title: 'Components/Animations/Tilt',
  tags: ['autodocs'],
    parameters: {
    docs: {
      description: {
        component: '<p>Apply `icon-tilt` inline to add the tilt animation.</p>The animation begins on page load and repeats three times in total and then stops.<p>The animation respects the users `prefers-reduced-motion: reduce`</p><p>TwoAnimations shows how to combine animations: add `icon-shake` to the button and `icon-tilt` to the icon inside it.</p>'
      }
    }
  },
};

const Template = (args) => ({
  setup() {
    return { args };
  },
  template: `
    <div style="min-height: 300px">
        <button class="btn btn--secondary">
            <i class="entypo--megaphone icon-tilt"></i>
        </button>
    </div>
  `,
});

export const Default = Template.bind({});

export const TwoAnimations = (args) => ({
  setup() {
    return { args };
    
  },
  template: `
    <div style="min-height: 300px">
        <button class="btn btn--secondary icon-shake">
            <i class="entypo--megaphone icon-tilt"></i>
        </button>
    </div>
  `,
});

Default.parameters = {
  docs: {
    source: {
      code: `
        <template>
            <div style="min-height: 300px">
                <button class="btn btn--secondary">
                    <i class="entypo--megaphone icon-tilt"></i>
                </button>
            </div>
        </template>`,
      language: 'html',
      format: true
    },
  },
};

TwoAnimations.parameters = {
  docs: {
    source: {
      code: `
        <template>
            <div style="min-height: 300px">
                <button class="btn btn--secondary icon-shake">
                    <i class="entypo--megaphone icon-tilt"></i>
                </button>
            </div>
        </template>`,
      language: 'html',
      format: true
    },
  },
};