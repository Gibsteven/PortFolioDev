import type { Project } from '@/types';
import { ref, get, child, set, push, remove } from 'firebase/database';
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from './firebase';

const dbRef = ref(database, 'projects');

export async function getAllProjects(): Promise<Project[]> {
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Handle cases where there might be no projects
            if (!data) return [];
            return Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching projects: ", error);
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    try {
        const snapshot = await get(child(ref(database), `projects/${id}`));
        if (snapshot.exists()) {
            return { id: snapshot.key, ...snapshot.val() } as Project;
        } else {
            console.log("No such document!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching project by ID: ", error);
        return undefined;
    }
}

export async function addProject(projectData: Omit<Project, 'id' | 'imagePath'> & { image: string, imagePath: string }) {
    const newProjectRef = push(dbRef);
    await set(newProjectRef, projectData);
    return newProjectRef.key;
}

export async function deleteProject(project: Project) {
    if (project.id) {
        await remove(child(dbRef, project.id));
        if (project.imagePath) {
            const imageRef = storageRef(storage, project.imagePath);
            await deleteObject(imageRef);
        }
    }
}