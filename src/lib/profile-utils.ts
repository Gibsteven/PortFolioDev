import type { Profile } from '@/types';
import { ref, get, set, update } from 'firebase/database';
import { database } from './firebase';

const dbRef = ref(database, 'profile');

export async function getProfile(): Promise<Profile | null> {
    console.log("Attempting to fetch profile...");
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            console.log("Profile data found.");
            return snapshot.val() as Profile;
        } else {
            console.log("No profile data found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching profile: ", error);
        return null;
    }
}

export async function updateProfile(profileData: Partial<Profile>) {
    console.log("Attempting to update profile with data:", profileData);
    const currentProfile = await getProfile() || {};
    const newProfileData = { ...currentProfile, ...profileData };
    await set(dbRef, newProfileData);
    console.log("Profile updated successfully.");
}
