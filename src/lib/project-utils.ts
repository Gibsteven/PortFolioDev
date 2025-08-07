import type { Project } from '@/types';
import { ref, get, child, set, push, remove, update } from 'firebase/database';
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from './firebase';

const dbRef = ref(database, 'projects');

export async function getAllProjects(): Promise<Project[]> {
    console.log("Attempting to fetch all projects...");
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            console.log("Projects data found.");
            const data = snapshot.val();
            // Handle cases where there might be no projects
            if (!data) {
                console.log("No projects exist in the database.");
                return [];
            }
            const projects = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            console.log(`Found ${projects.length} projects.`);
            return projects;
        } else {
            console.log("No projects found in the database.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching projects: ", error);
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    console.log(`Attempting to fetch project with ID: ${id}`);
    try {
        const snapshot = await get(child(ref(database), `projects/${id}`));
        if (snapshot.exists()) {
            console.log(`Project found with ID: ${id}`);
            return { id: snapshot.key, ...snapshot.val() } as Project;
        } else {
            console.log(`No project found with ID: ${id}`);
            return undefined;
        }
    } catch (error) {
        console.error(`Error fetching project with ID ${id}: `, error);
        return undefined;
    }
}

export async function addProject(projectData: Omit<Project, 'id'>) {
    console.log("Attempting to add new project with data:", projectData);
    const newProjectRef = push(dbRef);
    await set(newProjectRef, projectData);
    console.log(`Project added successfully with ID: ${newProjectRef.key}`);
    return newProjectRef.key;
}

export async function updateProjectStatus(projectId: string, status: 'active' | 'suspended') {
    console.log(`Attempting to update status for project ID: ${projectId} to ${status}`);
    const projectRef = child(dbRef, projectId);
    await update(projectRef, { status });
    console.log(`Project ${projectId} status updated to ${status}.`);
}

export async function deleteProject(projectId: string, imagePath?: string, videoPath?: string) {
    console.log(`Attempting to delete project with ID: ${projectId}`);
    if (projectId) {
        // Delete from Realtime Database
        await remove(child(dbRef, projectId));
        console.log(`Project ${projectId} deleted from Realtime Database.`);
        
        // Delete image from Storage
        if (imagePath) {
            console.log(`Attempting to delete image at path: ${imagePath}`);
            const imageRef = storageRef(storage, imagePath);
            await deleteObject(imageRef)
                .then(() => console.log(`Image deleted successfully from: ${imagePath}`))
                .catch(err => console.error("Error deleting image:", err));
        }

        // Delete video from Storage
        if (videoPath) {
            console.log(`Attempting to delete video at path: ${videoPath}`);
            const videoRef = storageRef(storage, videoPath);
            await deleteObject(videoRef)
                .then(() => console.log(`Video deleted successfully from: ${videoPath}`))
                .catch(err => console.error("Error deleting video:", err));
        }
    }
}
