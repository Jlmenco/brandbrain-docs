import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const heroLogo = useBaseUrl('/img/hero-logo.svg');
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src={heroLogo} alt="Brand Brain" width="100" height="100" style={{marginBottom: '1rem'}} />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p style={{fontSize: '1.1rem', opacity: 0.85, maxWidth: 600, margin: '0 auto 1.5rem'}}>
          Plataforma de marketing com IA para gerenciar multiplas marcas,
          influenciadores, campanhas e leads — tudo em um so lugar.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Comece Aqui
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/getting-started/quick-start"
            style={{marginLeft: '1rem', color: 'white', borderColor: 'white'}}>
            Quick Start
          </Link>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  const stats = [
    {value: '50+', label: 'Endpoints API'},
    {value: '13', label: 'Modelos de Dados'},
    {value: '3', label: 'Agentes IA'},
    {value: '127+', label: 'Testes Automatizados'},
  ];

  return (
    <section style={{padding: '3rem 0', background: 'var(--ifm-color-emphasis-100)'}}>
      <div className="container">
        <div className="row">
          {stats.map((stat, idx) => (
            <div key={idx} className="col col--3 text--center">
              <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--ifm-color-primary)'}}>
                {stat.value}
              </div>
              <div style={{fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)'}}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Autonomous Brand Intelligence System"
      description="Plataforma de marketing com IA para gerenciar multiplas marcas, influenciadores, campanhas e leads.">
      <HomepageHeader />
      <main>
        <StatsSection />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
