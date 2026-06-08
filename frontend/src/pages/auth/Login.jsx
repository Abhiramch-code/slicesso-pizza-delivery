import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      const role = resultAction.payload.user?.role;
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-surface font-body-md text-on-surface">
      {/* Left Side: High-Impact Visual Content */}
      <section className="hidden lg:flex lg:w-7/12 relative h-full min-h-[calc(100vh-4rem)] overflow-hidden bg-primary">
        <img 
          alt="Artisanal Pizza" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="/images/hero-pizza.jpg"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 pizza-hero-gradient flex flex-col justify-end p-margin-desktop bg-black/20">
          <div className="max-w-2xl mb-12 animate-fade-in">
            <h1 className="font-display-xl text-5xl md:text-7xl text-white italic font-black leading-tight mb-4">
              Slices
            </h1>
            <p className="font-headline-lg text-2xl text-white/90 font-medium">
              The ultimate engine for high-velocity kitchen systems.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Clean Authentication Canvas */}
      <section className="w-full lg:w-5/12 h-full min-h-[calc(100vh-4rem)] flex flex-col bg-surface relative z-10 shadow-2xl">
        <div className="flex-grow flex items-center justify-center px-margin-mobile md:px-20 py-12">
          <div className="w-full max-w-md animate-fade-in">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-on-surface-variant">Sign in to manage your kitchen operations.</p>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm" 
                    id="email" 
                    placeholder="kitchen@slicesso.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-medium text-on-surface-variant" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Kitchen'}
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-on-surface-variant">
              New to the system?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">Apply for Access</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
