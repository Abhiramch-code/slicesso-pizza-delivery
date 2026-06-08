import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../store/slices/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error, resetSent } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  if (resetSent) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
        <div className="w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <span className="text-5xl">✉️</span>
            <h2 className="text-2xl font-bold">Email Sent</h2>
            <p className="text-on-surface-variant">We've sent a password reset link to your email address. Please check your inbox.</p>
            <Link to="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-on-surface-variant">Enter your email to receive a reset link.</p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
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

          <button
            className="w-full bg-primary text-white py-4 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Remember your password?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;