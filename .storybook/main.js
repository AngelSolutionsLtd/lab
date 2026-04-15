/** @type { import('@storybook/vue-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../stories/Welcome.mdx",
    "../stories/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.mdx",
    "../pages/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../pages/**/*.mdx",
  ],
  staticDirs: ['../public', { from: '../fonts', to: '/fonts' }],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-webpack5-compiler-babel"
  ],
  framework: {
    name: "@storybook/vue3-webpack5",
    options: {}
  },
  docs: {},
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["vue-style-loader", "css-loader", "sass-loader"],
    });

    // Tiptap v2 packages have "type":"module" but also ship CJS builds via the
    // "require" condition in their exports map.  Putting "require" first in
    // conditionNames makes webpack prefer the CJS build for every @tiptap
    // package (and any other package with a "require" export condition).
    config.resolve.conditionNames = [
      'require',
      'import',
      'module',
      'browser',
      'default',
    ];

    return config;
  },
};

export default config;
