// This is a new file
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setProgress(0);
    setVisible(true);
  }, [pathname, searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(timer);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }

    return () => {
      clearInterval(timer);
    };
  }, [visible]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }
  }, [progress]);
  
  return (
    <div className={cn("fixed top-0 left-0 w-full h-1 z-50", visible ? "opacity-100" : "opacity-0", "transition-opacity duration-500")}>
       <Progress value={progress} className="h-1 bg-transparent [&>*]:bg-accent" />
    </div>
  );
}
