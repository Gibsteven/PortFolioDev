import type { Project } from '@/types';
import { ref, get, child } from 'firebase/database';
import { database } from './firebase';

const dbRef = ref(database);

// This function now fetches all projects from Realtime Database
export async function getAllProjects(): Promise<Project[]> {
    try {
        const snapshot = await get(child(dbRef, 'projects'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching projects: ", error);
        return [];
    }
}

// This function now fetches a single project by ID from Realtime Database
export async function getProjectById(id: string): Promise<Project | undefined> {
    try {
        const snapshot = await get(child(dbRef, `projects/${id}`));
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
