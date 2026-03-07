import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Multi-Brand AI',
    icon: '🧠',
    description: (
      <>
        Gerencie multiplas marcas com inteligencia artificial. Cada marca tem seu
        proprio Brand Kit, voz e personalidade — tudo em uma unica plataforma.
      </>
    ),
  },
  {
    title: 'Redistribuicao Inteligente',
    icon: '🔀',
    description: (
      <>
        Crie um conteudo macro e redistribua automaticamente para diferentes marcas
        e influenciadores, adaptando tom, formato e plataforma.
      </>
    ),
  },
  {
    title: 'RAG + Brand Intelligence',
    icon: '🔍',
    description: (
      <>
        Embeddings do Brand Kit alimentam a geracao de conteudo via RAG. A IA conhece
        profundamente cada marca para criar conteudo contextualizado.
      </>
    ),
  },
  {
    title: 'Workflow Completo',
    icon: '⚡',
    description: (
      <>
        Do rascunho a publicacao: criacao, revisao, aprovacao, agendamento e
        publicacao automatica com retry e backoff. Tudo auditado.
      </>
    ),
  },
  {
    title: 'Agentes Autonomos',
    icon: '🤖',
    description: (
      <>
        Marketing Agent gera conteudo e adapta brand kits. Market Agent monitora
        tendencias e gera briefings semanais de inteligencia competitiva.
      </>
    ),
  },
  {
    title: 'Analytics & Tracking',
    icon: '📊',
    description: (
      <>
        Metricas diarias, short links com UTM, pipeline de leads,
        campanhas ativas e dashboard em tempo real com graficos interativos.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md" style={{marginBottom: '2rem'}}>
        <div className="feature-icon">{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">Por que Brand Brain?</Heading>
          <p style={{fontSize: '1.2rem', color: 'var(--ifm-color-emphasis-700)'}}>
            A unica plataforma que une IA generativa, gestao de influenciadores,
            campanhas e leads em um sistema multi-marca integrado.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
