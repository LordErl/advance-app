import HeroScreenshot from '@/components/HeroScreenshot';
import BackgroundCarousel from '@/components/BackgroundCarousel';
import Features from '@/components/Features';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="w-full">
      <main className="relative isolate overflow-hidden">
        {/* Hero Section */}
        <section className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="bg-gradient-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
              O futuro das suas finanças, hoje.
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary-light dark:text-text-secondary-dark">
              Controle seus adiantamentos salariais com uma plataforma inteligente e flexível. Tenha visibilidade e poder sobre seu fluxo de caixa como nunca antes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/register"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
              >
                Começar Agora
              </a>
              <a href="/demo" className="text-sm font-semibold leading-6 text-text-light dark:text-text-dark">
                Ver demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="mt-16 flow-root sm:mt-24">
            <HeroScreenshot />
          </div>
        </section>

        <Features />

        <FinalCTA />

        <BackgroundCarousel />
      </main>
      <Footer />
    </div>
  );
}
