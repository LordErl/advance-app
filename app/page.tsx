import HeroScreenshot from '@/components/HeroScreenshot';
import BackgroundCarousel from '@/components/BackgroundCarousel';
import Features from '@/components/Features';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="w-full relative">
      {/* Enhanced background with 3D elements */}
      <div className="fixed inset-0 -z-10">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-light-bg dark:bg-dark-bg transition-all duration-1000" />
        
        {/* Floating 3D elements - Light theme */}
        <div className="dark:hidden absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-light-accentBlue rounded-full opacity-20 blur-3xl animate-float animate-pulse-neon" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-light-accentMagenta rounded-full opacity-15 blur-3xl animate-float-delayed" />
          <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-light-accentLime rounded-full opacity-10 blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-light-accentGold rounded-full opacity-10 blur-3xl animate-float-delayed" />
        </div>
        
        {/* Floating 3D elements - Dark theme */}
        <div className="hidden dark:block absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-dark-accentBlue rounded-full opacity-20 blur-3xl animate-float animate-pulse-neon" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-dark-accentMagenta rounded-full opacity-15 blur-3xl animate-float-delayed" />
          <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-dark-accentLime rounded-full opacity-10 blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-dark-accentGold rounded-full opacity-10 blur-3xl animate-float-delayed" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <main className="relative isolate overflow-hidden">
        {/* Hero Section */}
        <section className="px-6 py-24 sm:py-32 lg:px-8 min-h-screen flex items-center perspective-container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-readable-light dark:text-readable-dark animate-fade-in">
              <span className="block">O futuro das suas</span>
              <span className="block text-glow-cyan dark:text-dark-accentBlue text-glow-strong">
                finanças, hoje.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-readable-light dark:text-readable-dark opacity-90 animate-slide-up">
              Controle seus adiantamentos salariais com uma plataforma inteligente e flexível. 
              Tenha visibilidade e poder sobre seu fluxo de caixa como nunca antes.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6 animate-slide-up">
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 transform perspective-container
                bg-light-primary dark:bg-dark-primary 
                text-readable-light dark:text-readable-dark 
                shadow-neon-cyan dark:shadow-neon-blue-soft
                btn-3d-light dark:btn-3d-dark
                hover:scale-105 hover:-translate-y-2 hover:shadow-neon-cyan dark:hover:shadow-neon-blue-soft
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Começar Agora
              </a>
              <a href="/demo" className="text-base font-semibold leading-6 transition-all duration-300 hover:scale-105
                text-readable-light dark:text-readable-dark
                hover:text-glow-cyan dark:hover:text-dark-accentBlue">
                Ver demo <span aria-hidden="true" className="ml-1 text-glow-cyan dark:text-dark-accentBlue">→</span>
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