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
  staticDirs: ['../public'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-webpack5-compiler-babel",
    "@chromatic-com/storybook"
  ],
  framework: {
    name: "@storybook/vue3-webpack5",
    options: {}
  },
  docs: {},
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["vue-style-loader","css-loader","sass-loader"],
    });
    return config;
  },
};

export default config;
