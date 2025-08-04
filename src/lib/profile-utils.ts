import type { Profile } from '@/types';
import { ref, get, set } from 'firebase/database';
import { database } from './firebase';

const dbRef = ref(database, 'profile');

export async function getProfile(): Promise<Profile | null> {
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val() as Profile;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching profile: ", error);
        return null;
    }
}

export async function updateProfile(profileData: Partial<Profile>) {
    await set(dbRef, profileData);
}
