import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/dashboard');
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
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Create Kitchen Account</h2>
              <p className="text-on-surface-variant">Start your 14-day premium Slices trial.</p>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Full Name</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm" 
                  placeholder="John Doe" 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Work Email</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm" 
                  placeholder="manager@pizzeria.com" 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Password</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm" 
                  placeholder="Create strong password" 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="flex gap-1 mt-2">
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-surface-container-highest rounded-full"></div>
                  <div className="h-1 flex-1 bg-surface-container-highest rounded-full"></div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Start Free Trial'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
            <p className="mt-6 text-center text-[10px] text-on-surface-variant/60 uppercase tracking-tighter">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
