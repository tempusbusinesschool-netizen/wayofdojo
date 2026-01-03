import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Ignorer les erreurs de removeChild causées par les extensions de navigateur
    if (error.message && error.message.includes('removeChild')) {
      console.warn('Extension de navigateur a modifié le DOM:', error.message);
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur mais ne pas crasher pour les erreurs de DOM
    if (error.message && error.message.includes('removeChild')) {
      console.warn('Erreur DOM ignorée (probablement une extension):', error);
      return;
    }
    console.error('Erreur capturée:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-red-500/50 rounded-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-xl font-bold text-white mb-2">Oups ! Une erreur s'est produite</h2>
            <p className="text-slate-400 mb-4">
              Pas de panique ! Rechargez la page pour continuer.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-2 rounded-lg"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
