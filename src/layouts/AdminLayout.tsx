
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to access this page",
        variant: "destructive"
      });
      navigate('/auth');
    } else if (!isLoading && user && profile && profile.role !== 'Admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, profile, isLoading, navigate, toast]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-onlyl34ks-accent"></div>
      </div>
    );
  }

  // If not loading and user is not authenticated, redirect to auth page
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated but not an admin, redirect to home page
  if (!isLoading && user && profile && profile.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and is an admin, render children
  return <>{children}</>;
}
