import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/architecture',
        'getting-started/environment',
      ],
    },
    {
      type: 'category',
      label: 'Conceitos',
      items: [
        'core-concepts/multi-tenancy',
        'core-concepts/rbac',
        'core-concepts/workflows',
        'core-concepts/data-model',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/authentication',
        'api-reference/endpoints',
        'api-reference/errors',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/content',
        'features/redistribution',
        'features/influencers',
        'features/campaigns',
        'features/leads',
        'features/analytics',
        'features/notifications',
        'features/rag',
        'features/ui-ux',
        'features/settings',
        'features/onboarding',
      ],
    },
    {
      type: 'category',
      label: 'Agentes IA',
      items: [
        'agents/marketing-agent',
        'agents/market-agent',
        'agents/ai-gateway',
      ],
    },
    {
      type: 'category',
      label: 'Deploy',
      items: [
        'deployment/docker',
        'deployment/production',
      ],
    },
    'roadmap',
  ],
};

export default sidebars;
