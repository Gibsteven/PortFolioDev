// This is a new file
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function AdminPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="font-headline text-4xl mb-4">Welcome, Admin!</h1>
      <p className="text-muted-foreground mb-8">This is your admin dashboard. You can manage your projects from here.</p>
      <Button onClick={() => auth.signOut()}>Sign Out</Button>
    </div>
  );
}

export default AdminPage;
