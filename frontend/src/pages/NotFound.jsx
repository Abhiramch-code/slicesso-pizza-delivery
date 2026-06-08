import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8 text-center space-y-6">
        <span className="text-8xl">🍕</span>
        <h1 className="text-6xl font-black text-primary">404</h1>
        <h2 className="text-2xl font-bold text-on-surface">Page Not Found</h2>
        <p className="text-on-surface-variant">Looks like this pizza got lost in delivery. Let's get you back to a hot slice.</p>
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;