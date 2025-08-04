'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Wand2, BrainCircuit, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { enhanceDescriptionAction, type EnhanceFormState } from '@/app/projects/[id]/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const initialState: EnhanceFormState = {
  status: 'idle',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Enhancing...' : 'Enhance with AI'}
      <Wand2 className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function DescriptionEnhancer({ initialDescription }: { initialDescription: string }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(enhanceDescriptionAction, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
      // Do not reset the form to show the results
    } else if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit />
          AI Description Enhancer
        </CardTitle>
        <CardDescription>
          Refine your project description for a specific audience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={initialDescription}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="e.g., Recruiters, Potential Clients, Open-Source Contributors"
              required
            />
          </div>
          <SubmitButton />
        </form>

        {state.status === 'success' && state.data && (
          <div className="mt-6 space-y-6">
            <Separator />
            <div>
              <h3 className="font-headline text-lg flex items-center gap-2 mb-2">
                <Wand2 className="text-primary" />
                Enhanced Description
              </h3>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{state.data.enhancedDescription}</p>
            </div>
            <div>
                <h3 className="font-headline text-lg flex items-center gap-2 mb-2">
                    <Lightbulb className="text-primary" />
                    Suggestions
                </h3>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md whitespace-pre-line">{state.data.suggestions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
