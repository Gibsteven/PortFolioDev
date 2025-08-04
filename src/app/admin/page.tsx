'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, set, push, remove } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from 'lucide-react';

const projectSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters.'),
    type: z.enum(['Web App', 'Mobile App', 'Full-Stack']),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters.'),
    longDescription: z.string().min(20, 'Long description must be at least 20 characters.'),
    image: z.any().refine((files) => files?.length == 1, "Image is required.").refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
    'data-ai-hint': z.string().min(2, 'AI hint must be at least 2 characters.'),
    tags: z.string().min(2, 'Please add at least one tag.'),
    url: z.string().url('Please enter a valid project URL.').optional().or(z.literal('')),
});


function AdminPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  
  const [snapshots, projectsLoading] = useList(dbRef(database, 'projects'));

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      type: 'Web App',
      shortDescription: '',
      longDescription: '',
      image: undefined,
      'data-ai-hint': '',
      tags: '',
      url: '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
        const imageFile = values.image[0] as File;
        const imageStorageRef = storageRef(storage, `projects/${Date.now()}-${imageFile.name}`);
        const uploadResult = await uploadBytes(imageStorageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);

        const tagsArray = values.tags.split(',').map(tag => tag.trim());
        
        const projectsRef = dbRef(database, 'projects');
        const newProjectRef = push(projectsRef);

        await set(newProjectRef, {
            ...values,
            image: imageUrl,
            imagePath: uploadResult.ref.fullPath,
            tags: tagsArray,
        });

        toast({
            title: "Project Added",
            description: "Your new project has been saved successfully.",
        });
        form.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem adding your project.",
        });
    }
  }

  async function deleteProject(project: Project) {
    if (window.confirm("Are you sure you want to delete this project?")) {
        try {
            await remove(dbRef(database, `projects/${project.id}`));
            
            if (project.imagePath) {
                const imageRef = storageRef(storage, project.imagePath);
                await deleteObject(imageRef);
            }

            toast({
                title: "Project Deleted",
                description: "The project has been deleted successfully.",
            });
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "There was a problem deleting the project.",
            });
        }
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const projects = snapshots ? snapshots.map(snapshot => ({ id: snapshot.key, ...snapshot.val() } as Project)) : [];

  return (
    <div className="container mx-auto py-12">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h1 className="font-headline text-4xl mb-2">Welcome, Admin!</h1>
                <p className="text-muted-foreground">This is your admin dashboard. You can manage your projects from here.</p>
            </div>
            <Button onClick={() => auth.signOut()}>Sign Out</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Projects</CardTitle>
                        <CardDescription>A list of all your projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projectsLoading && <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>}
                                {!projectsLoading && projects.map(project => {
                                    return (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.title}</TableCell>
                                            <TableCell>{project.type}</TableCell>
                                            <TableCell>
                                                <Button variant="destructive" size="icon" onClick={() => deleteProject(project)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Project</CardTitle>
                        <CardDescription>Fill out the form to add a new project to your portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="My Awesome Project" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Project Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a project type" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="Web App">Web App</SelectItem>
                                        <SelectItem value="Mobile App">Mobile App</SelectItem>
                                        <SelectItem value="Full-Stack">Full-Stack</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                              control={form.control}
                              name="shortDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Short Description</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="A brief, catchy description." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="longDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Long Description</FormLabel>
                                  <FormControl>
                                    <Textarea rows={5} placeholder="A detailed description of the project." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Project Image</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Select an image from your device (max 5MB).
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <FormField
                              control={form.control}
                              name="data-ai-hint"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image AI Hint</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 'project management'" {...field} />
                                  </FormControl>
                                   <FormDescription>
                                    One or two keywords for image generation.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tags</FormLabel>
                                  <FormControl>
                                    <Input placeholder="React, Next.js, Firebase" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Comma-separated list of technologies.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="url"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://my-project.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Project
                            </Button>
                          </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

export default AdminPage;
