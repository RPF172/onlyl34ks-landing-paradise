
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message || "Please check your credentials and try again",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message || "Please try again",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign Up Successful",
            description: "Please check your email for verification (if required)",
          });
          setIsLogin(true);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-onlyl34ks-bg-dark flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-onlyl34ks-card border-onlyl34ks-bg-light/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center text-onlyl34ks-text-muted">
            {isLogin ? 'Access your account to continue' : 'Join ONLYL34KS today'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-onlyl34ks-text-light">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-onlyl34ks-bg-dark text-white border-onlyl34ks-bg-light/30"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-onlyl34ks-text-light">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-onlyl34ks-bg-dark text-white border-onlyl34ks-bg-light/30"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white"
            >
              {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-onlyl34ks-accent hover:text-onlyl34ks-accent-dark"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
