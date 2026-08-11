import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { db, doc, getDoc } from '../firebase/firestore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { getDefaultRedirectPath } from '../utils/roleGuards';
import { UserProfile } from '../types';
import { Mail, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch user profile from Firestore to determine role
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        navigate(getDefaultRedirectPath(profile.role));
      } else {
        // Fallback default role if profile doc doesn't exist yet
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access blocked due to multiple failed login attempts. Try again later.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow effects */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-2xl shadow-xl shadow-brand-600/30 mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back to MARK</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to access your exam preparation dashboard</p>
        </div>

        <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-slate-100 text-xl">Sign In</CardTitle>
            <CardDescription className="text-slate-400">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4">
                <ErrorState message={error} />
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center text-slate-300 gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-brand-600 focus:ring-brand-500" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" isLoading={isLoading}>
                Sign In to Platform
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
