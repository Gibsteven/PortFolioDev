'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useList, useObjectVal } from 'react-firebase-hooks/database';
import { useToast } from '@/hooks/use-toast';
import type { Project, Profile } from '@/types';
import { addProject, deleteProject } from '@/lib/project-utils';
import { updateProfile } from '@/lib/profile-utils';
import { ref as dbRef } from 'firebase/database';

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
    video: z.any().refine((files) => files?.[0]?.size <= 50000000, `Max file size is 50MB.`).optional(),
    'data-ai-hint': z.string().min(2, 'AI hint must be at least 2 characters.'),
    tags: z.string().min(2, 'Please add at least one tag.'),
    url: z.string().url('Please enter a valid project URL.').optional().or(z.literal('')),
});

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    aboutDescription: z.string().min(20, 'About description must be at least 20 characters.'),
    profilePicture: z.any().refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`).optional(),
    cv: z.any().refine((files) => files?.[0]?.size <= 10000000, `Max file size is 10MB.`).optional(),
});


function AdminPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  
  const [snapshots, projectsLoading] = useList(dbRef(database, 'projects'));
  const [profile, profileLoading] = useObjectVal<Profile>(dbRef(database, 'profile'));

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      type: 'Web App',
      shortDescription: '',
      longDescription: '',
      image: undefined,
      video: undefined,
      'data-ai-hint': '',
      tags: '',
      url: '',
    },
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      aboutDescription: '',
      profilePicture: undefined,
      cv: undefined,
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name,
        aboutDescription: profile.aboutDescription,
      });
    }
  }, [profile, profileForm]);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  async function onProjectSubmit(values: z.infer<typeof projectSchema>) {
    try {
        // Handle Image Upload
        const imageFile = values.image[0] as File;
        const imageStorageRef = storageRef(storage, `projects/${Date.now()}-${imageFile.name}`);
        const imageUploadResult = await uploadBytes(imageStorageRef, imageFile);
        const imageUrl = await getDownloadURL(imageUploadResult.ref);
        const imagePath = imageUploadResult.ref.fullPath;

        let videoUrl: string | undefined = undefined;
        let videoPath: string | undefined = undefined;

        // Handle Video Upload
        if (values.video && values.video.length > 0) {
            const videoFile = values.video[0] as File;
            const videoStorageRef = storageRef(storage, `projects/${Date.now()}-${videoFile.name}`);
            const videoUploadResult = await uploadBytes(videoStorageRef, videoFile);
            videoUrl = await getDownloadURL(videoUploadResult.ref);
            videoPath = videoUploadResult.ref.fullPath;
        }

        const tagsArray = values.tags.split(',').map(tag => tag.trim());
        
        await addProject({
            ...values,
            image: imageUrl,
            imagePath: imagePath,
            video: videoUrl,
            videoPath: videoPath,
            tags: tagsArray,
        });

        toast({
            title: "Project Added",
            description: "Your new project has been saved successfully.",
        });
        projectForm.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem adding your project.",
        });
    }
  }

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    try {
        let imageUrl = profile?.profilePicture;
        let imagePath = profile?.profilePicturePath;
        let cvUrl = profile?.cvUrl;
        let cvPath = profile?.cvPath;

        if (values.profilePicture && values.profilePicture.length > 0) {
            const imageFile = values.profilePicture[0] as File;
            const imageStorageRef = storageRef(storage, `profile/${Date.now()}-${imageFile.name}`);
            const uploadResult = await uploadBytes(imageStorageRef, imageFile);
            imageUrl = await getDownloadURL(uploadResult.ref);
            imagePath = uploadResult.ref.fullPath;
        }

        if (values.cv && values.cv.length > 0) {
            const cvFile = values.cv[0] as File;
            const cvStorageRef = storageRef(storage, `profile/${Date.now()}-${cvFile.name}`);
            const uploadResult = await uploadBytes(cvStorageRef, cvFile);
            cvUrl = await getDownloadURL(uploadResult.ref);
            cvPath = uploadResult.ref.fullPath;
        }

        await updateProfile({
            ...values,
            profilePicture: imageUrl,
            profilePicturePath: imagePath,
            cvUrl: cvUrl,
            cvPath: cvPath,
        });

        toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
        });
        profileForm.reset(values);
        profileForm.setValue('profilePicture', undefined)
        profileForm.setValue('cv', undefined)
    } catch (error) {
        console.error("Error updating profile: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem updating your profile.",
        });
    }
}


  async function handleDelete(project: Project) {
    if (window.confirm("Are you sure you want to delete this project?")) {
        try {
            await deleteProject(project);
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
            <div className="lg:col-span-2 space-y-12">
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
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(project)}>
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

                 <Card>
                    <CardHeader>
                        <CardTitle>Manage Profile</CardTitle>
                        <CardDescription>Update your public profile information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {profileLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> :
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Jane Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="aboutDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>About Description</FormLabel>
                                  <FormControl>
                                    <Textarea rows={5} placeholder="Tell us about yourself." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                                control={profileForm.control}
                                name="profilePicture"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Profile Picture</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload a new profile picture (max 5MB). Leave blank to keep the current one.
                                        {profile?.profilePicture && <img src={profile.profilePicture} alt="Current profile" className="w-20 h-20 rounded-full mt-2" />}
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <FormField
                                control={profileForm.control}
                                name="cv"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>CV (PDF)</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload a new CV (max 10MB). Leave blank to keep the current one.
                                        {profile?.cvUrl && <a href={profile.cvUrl} target="_blank" className="text-sm text-blue-500 hover:underline mt-2 block">View Current CV</a>}
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                             />
                            <Button type="submit" className="w-full" disabled={profileForm.formState.isSubmitting}>
                                {profileForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Profile
                            </Button>
                          </form>
                        </Form>
                        }
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
                        <Form {...projectForm}>
                          <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-6">
                            <FormField
                              control={projectForm.control}
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
                                control={projectForm.control}
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
                              control={projectForm.control}
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
                              control={projectForm.control}
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
                                control={projectForm.control}
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
                                control={projectForm.control}
                                name="video"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Project Video (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Select a video from your device (max 50MB).
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <FormField
                              control={projectForm.control}
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
                              control={projectForm.control}
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
                              control={projectForm.control}
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
                            <Button type="submit" className="w-full" disabled={projectForm.formState.isSubmitting}>
                                {projectForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
