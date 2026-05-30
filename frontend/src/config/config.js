const cleanEnv = (val) => String(val || '').replace(/^["'\s]+|["'\s]+$/g, '');

const config = {
    appwriteUrl: cleanEnv(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: cleanEnv(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: cleanEnv(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: cleanEnv(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId: cleanEnv(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default config