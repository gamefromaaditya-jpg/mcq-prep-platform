import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md z-10">
        <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-slate-100 text-xl">Reset Password</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your email to receive password reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Reset Link Sent!</h3>
                <p className="text-xs text-slate-400">
                  We have dispatched a password reset link to <strong className="text-slate-200">{email}</strong>. Please check your inbox.
                </p>
                <Link to="/login" className="inline-block mt-4">
                  <Button variant="outline" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4">
                    <ErrorState message={error} />
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />

                  <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" isLoading={isLoading}>
                    Send Reset Link
                  </Button>
                </form>

                <div className="mt-6 text-center text-xs">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 font-medium">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
