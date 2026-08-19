import Link from "next/link";

import styles from "./page.module.css";

const features = [
  {
    icon: "✓",
    title: "Capture sem atrito",
    copy: "Jogue uma tarefa na Inbox em segundos e organize depois, sem quebrar seu foco.",
  },
  {
    icon: "▦",
    title: "Planeje a semana",
    copy: "Enxergue projetos, tarefas e sessões em uma rotina que respeita o tempo que você realmente tem.",
  },
  {
    icon: "◫",
    title: "Organize por projetos",
    copy: "Separe faculdade, cursos, carreira e vida pessoal sem transformar tudo em uma planilha pesada.",
  },
  {
    icon: "↗",
    title: "Acompanhe o progresso",
    copy: "Veja o que avançou, o que precisa de atenção e ajuste o plano sem culpa quando a semana mudar.",
  },
];

function ProductPreview() {
  return (
    <div className={styles.previewScene} aria-hidden="true">
      <div className={styles.previewGlow} />
      <div className={styles.desktopMockup}>
        <div className={styles.desktopBar}>
          <span className={styles.miniMark} />
          <strong>TaskIT</strong>
          <span className={styles.searchPill}>Buscar tarefas, projetos...</span>
        </div>
        <div className={styles.desktopBody}>
          <aside className={styles.previewSidebar}>
            <b>Início</b>
            <span>Semana</span>
            <span>Inbox</span>
            <span>Projetos</span>
          </aside>
          <div className={styles.weekPreview}>
            <div className={styles.weekTitle}>
              <div>
                <strong>Minha semana</strong>
                <small>18–24 de agosto</small>
              </div>
              <span>68%</span>
            </div>
            <div className={styles.weekDays}>
              <b>Seg</b>
              <b>Ter</b>
              <b>Qua</b>
              <b>Qui</b>
              <b>Sex</b>
            </div>
            <div className={styles.weekGrid}>
              <i className={styles.previewTaskA}>Algoritmos</i>
              <i className={styles.previewTaskB}>Aula</i>
              <i className={styles.previewTaskC}>Projeto</i>
              <i className={styles.previewTaskD}>Revisão</i>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.phoneMockup}>
        <div className={styles.phoneTop}>9:41</div>
        <div className={styles.phoneBrand}>
          <span className={styles.miniMark} />
          <b>TaskIT</b>
        </div>
        <h3>Bom dia 👋</h3>
        <p>Vamos fazer hoje render?</p>
        <div className={styles.focusCard}>
          <small>Foco de hoje</small>
          <strong>3 tarefas principais</strong>
          <span />
        </div>
        <ul className={styles.phoneTasks}>
          <li>
            <i /> Revisar matemática
          </li>
          <li>
            <i /> Ler capítulo 4
          </li>
          <li>
            <i /> Projeto final
          </li>
        </ul>
      </div>
      <div className={styles.mascot}>
        <span className={styles.mascotLeaf}>⌁</span>
        <div className={styles.mascotFace}>
          <i />
          <i />
          <b>⌣</b>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/" aria-label="TaskIT — início">
          <span className={styles.logoMark} aria-hidden="true" />
          <span>TaskIT</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href="#calendar">Google Calendar</a>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.signIn} href="/login">
            Entrar
          </Link>
          <Link className={styles.signUp} href="/login?mode=signup">
            Criar conta <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Organize. Estude. Avance.</p>
          <h1>
            Sua semana de estudos, <span>com clareza.</span>
          </h1>
          <p className={styles.heroLead}>
            TaskIT reúne tarefas, projetos e planejamento semanal em um lugar
            leve. Capture o que precisa fazer, priorize o que importa e adapte a
            rotina sem transformar organização em mais uma obrigação.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryCta} href="/login?mode=signup">
              Criar minha conta <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryCta} href="/login">
              Já tenho uma conta
            </Link>
          </div>

          <ul className={styles.trustList} aria-label="Benefícios iniciais">
            <li>Grátis para começar</li>
            <li>Sem cartão</li>
            <li>Calendar opcional</li>
          </ul>
        </div>

        <ProductPreview />
      </section>

      <section
        className={styles.proofStrip}
        aria-label="Para diferentes rotinas de estudo"
      >
        <strong>
          Feito para quem precisa estudar e ainda viver a própria vida.
        </strong>
        <span>Faculdade</span>
        <span>Concursos</span>
        <span>Programação</span>
        <span>Certificações</span>
        <span>Projetos pessoais</span>
      </section>

      <section className={styles.section} id="recursos">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Menos caos, mais contexto</p>
          <h2>Tudo o que você precisa para cuidar da semana.</h2>
          <p>
            Sem excesso de dashboards. Cada parte do TaskIT existe para ajudar
            você a decidir o próximo passo com menos carga mental.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <span className={styles.featureIcon} aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workflow} id="como-funciona">
        <div className={styles.workflowIntro}>
          <p className={styles.eyebrow}>Uma rotina simples</p>
          <h2>Capture agora. Planeje depois. Execute com foco.</h2>
          <p>
            TaskIT separa o momento de lembrar do momento de planejar. Você não
            precisa interromper o estudo para organizar tudo perfeitamente.
          </p>
        </div>

        <ol className={styles.steps}>
          <li>
            <span>01</span>
            <div>
              <h3>Capture na Inbox</h3>
              <p>Digite o título da tarefa e continue o que estava fazendo.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Dê contexto</h3>
              <p>
                Associe projeto, prioridade, prazo e estimativa quando fizer
                sentido.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Monte uma semana possível</h3>
              <p>
                Transforme tarefas em sessões de estudo compatíveis com sua
                disponibilidade.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className={styles.calendar} id="calendar">
        <div>
          <p className={styles.eyebrow}>Google Calendar</p>
          <h2>Sua agenda entra no planejamento — quando você quiser.</h2>
          <p>
            A integração com Google Calendar será opcional e separada do login.
            Você poderá escolher uma ou mais agendas relevantes para considerar
            compromissos reais ao montar sua semana.
          </p>
          <span className={styles.comingSoon}>
            Integração em desenvolvimento
          </span>
        </div>

        <div className={styles.calendarCard} aria-hidden="true">
          <div className={styles.calendarTop}>
            <span />
            <strong>Semana</strong>
            <small>18–24 ago</small>
          </div>
          <div className={styles.calendarGrid}>
            <i className={styles.blockA}>Estudo</i>
            <i className={styles.blockB}>Aula</i>
            <i className={styles.blockC}>Projeto</i>
            <i className={styles.blockD}>Revisão</i>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <p className={styles.eyebrow}>Comece pelo essencial</p>
          <h2>Organizar seus estudos não deveria consumir sua energia.</h2>
          <p>
            Crie sua conta e comece pela Inbox. O resto pode vir aos poucos.
          </p>
        </div>
        <div className={styles.finalActions}>
          <Link className={styles.primaryCta} href="/login?mode=signup">
            Criar conta grátis <span aria-hidden="true">→</span>
          </Link>
          <Link className={styles.secondaryCta} href="/login">
            Entrar
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <span className={styles.logoMark} aria-hidden="true" />
          <div>
            <strong>TaskIT</strong>
            <p>Planejamento de estudos com clareza, calma e foco.</p>
          </div>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/login">Entrar</Link>
          <Link href="/login?mode=signup">Criar conta</Link>
          <a href="#recursos">Recursos</a>
          <a href="#calendar">Calendar</a>
        </div>
        <p className={styles.copyright}>© 2026 TaskIT.</p>
      </footer>
    </main>
  );
}
