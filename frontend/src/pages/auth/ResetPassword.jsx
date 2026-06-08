import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../store/slices/authSlice';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    const result = await dispatch(resetPassword({ token, password }));
    if (resetPassword.fulfilled.match(result)) {
      setSuccess(true);
    }
  };

  if (!token) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
        <div className="w-full max-w-md p-8 text-center space-y-4">
          <span className="text-5xl">🔗</span>
          <h2 className="text-2xl font-bold">Invalid Link</h2>
          <p className="text-on-surface-variant">No reset token found. Please request a new password reset link.</p>
          <Link to="/forgot-password" className="text-primary font-bold hover:underline">Request Reset</Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
        <div className="w-full max-w-md p-8 text-center space-y-4">
          <span className="text-5xl">✅</span>
          <h2 className="text-2xl font-bold">Password Reset!</h2>
          <p className="text-on-surface-variant">Your password has been reset successfully. You can now log in with your new password.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-on-surface-variant">Enter your new password below.</p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant ml-1">New Password</label>
            <input
              className="w-full px-4 py-4 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
              placeholder="Create strong password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Confirm Password</label>
            <input
              className="w-full px-4 py-4 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
              placeholder="Confirm your password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            className="w-full bg-primary text-white py-4 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            type="submit"
            disabled={isLoading || (confirmPassword && password !== confirmPassword)}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;