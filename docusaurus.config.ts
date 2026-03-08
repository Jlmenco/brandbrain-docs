import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Brand Brain',
  tagline: 'Autonomous Brand Intelligence System',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://jlmenco.github.io',
  baseUrl: '/brandbrain-docs/',

  organizationName: 'Jlmenco',
  projectName: 'brandbrain-docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Brand Brain',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentacao',
        },
        {
          href: 'https://github.com/Jlmenco',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentacao',
          items: [
            {
              label: 'Introducao',
              to: '/docs/intro',
            },
            {
              label: 'Quick Start',
              to: '/docs/getting-started/quick-start',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference/endpoints',
            },
          ],
        },
        {
          title: 'Produto',
          items: [
            {
              label: 'Features',
              to: '/docs/features/content',
            },
            {
              label: 'Agentes IA',
              to: '/docs/agents/marketing-agent',
            },
            {
              label: 'Roadmap',
              to: '/docs/roadmap',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Brand Brain. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
