import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../store/slices/authSlice';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token)).then((result) => {
        if (verifyEmail.fulfilled.match(result)) {
          setVerified(true);
        }
      });
    }
  }, [token, dispatch]);

  if (!token) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
        <div className="w-full max-w-md p-8 text-center space-y-4">
          <span className="text-5xl">🔗</span>
          <h2 className="text-2xl font-bold">Invalid Link</h2>
          <p className="text-on-surface-variant">No verification token found. Please check your email for the correct link.</p>
          <Link to="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
        </div>
      </main>
    );
  }

  if (verified) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
        <div className="w-full max-w-md p-8 text-center space-y-4">
          <span className="text-5xl">✅</span>
          <h2 className="text-2xl font-bold">Email Verified!</h2>
          <p className="text-on-surface-variant">Your email has been verified successfully. You can now access all features.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8 text-center space-y-4">
        <span className="text-5xl animate-pulse">⏳</span>
        <h2 className="text-2xl font-bold">Verifying Email...</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </main>
  );
};

export default VerifyEmail;