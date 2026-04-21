import ArticleForm from "@/components/ArticleForm";

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* ── Hero Section ── */}
      <main className="container" id="main-content">
        <section className="hero animate-in" aria-labelledby="hero-title">
          <div className="hero-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            AI-Powered Article SEO System
          </div>

          <h1 id="hero-title" className="hero-title">
            Publish Smarter with{" "}
            <span className="gradient-text">AI SEO Automation</span>
          </h1>

          <p className="hero-subtitle">
            Submit any article and our AI pipeline instantly generates
            primary keywords, long-tail phrases, meta tags, and ranking insights
            — stored automatically in Google Sheets.
          </p>

          {/* How it works */}
          <div className="steps-bar" aria-label="Process steps">
            <div className="step-item">
              <span className="step-num">1</span>
              Submit Article
            </div>
            <div className="step-separator" aria-hidden="true" />
            <div className="step-item">
              <span className="step-num">2</span>
              n8n Ingests Data
            </div>
            <div className="step-separator" aria-hidden="true" />
            <div className="step-item">
              <span className="step-num">3</span>
              AI Generates SEO
            </div>
            <div className="step-separator" aria-hidden="true" />
            <div className="step-item">
              <span className="step-num">4</span>
              Saved to Sheets
            </div>
          </div>
        </section>

        {/* ── Form Card ── */}
        <section className="animate-in animate-in-delay" aria-label="Article submission form">
          <ArticleForm />
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer animate-in animate-in-delay-2">
        <p>
          Built with{" "}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
          {" · "}
          <a href="https://n8n.io" target="_blank" rel="noopener noreferrer">n8n Workflows</a>
          {" · "}
          <a href="https://openai.com" target="_blank" rel="noopener noreferrer">OpenAI GPT-4o</a>
          {" · "}
          <a
            href="https://github.com/Saurabh07703/Article-Publishing-SEO-Automation-System"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
