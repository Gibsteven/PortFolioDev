import type { Project } from '@/types';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// This function now fetches all projects from Firestore
export async function getAllProjects(): Promise<Project[]> {
    try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
        console.error("Error fetching projects: ", error);
        return [];
    }
}

// This function now fetches a single project by ID from Firestore
export async function getProjectById(id: string): Promise<Project | undefined> {
    try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Project;
        } else {
            console.log("No such document!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching project by ID: ", error);
        return undefined;
    }
}
