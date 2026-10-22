export default {
  title: 'Components/Animations/Shake',
  tags: ['autodocs'],
    parameters: {
    docs: {
      description: {
        component: '<p>Apply `icon-shake` inline to add the shake animation.</p>The animation begins on page load and repeats three times in total and then stops.<p>The animation respects the users `prefers-reduced-motion: reduce`</p>'
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
      <button class="btn btn--secondary mr-5 icon-shake">Shake</button>
    </div>
  `,
});

export const Default = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `
        <template>
            <div style="min-height: 300px">
                <button class="btn btn--secondary mr-5 icon-shake">Shake</button>
            </div>
        </template>`,
      language: 'html',
      format: true
    },
  },
};