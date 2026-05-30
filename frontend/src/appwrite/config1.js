import config from "../config/config.js";
import { Client, ID, Databases, Storage, Query} from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);


    }

    mapDocument(doc) {
        if (!doc) return null;
        console.log("🔍 mapDocument raw keys:", Object.keys(doc).filter(k => !k.startsWith('$')));
        console.log("🔍 mapDocument featuredimage:", doc.featuredimage, "| featuredImage:", doc.featuredImage);
        return {
            ...doc,
            featuredImage: doc.featuredimage || doc.featuredImage,
        };
    }

    mapDocuments(res) {
        if (!res || !res.documents) return res;
        return {
            ...res,
            documents: res.documents.map((doc) => this.mapDocument(doc))
        };
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        // Validate required fields before hitting the API
        if (!userId) {
            throw new Error("Cannot create post: User ID is missing. Please log in again.");
        }
        if (!title) {
            throw new Error("Cannot create post: Title is missing.");
        }
        if (!slug) {
            throw new Error("Cannot create post: Slug is missing.");
        }

        try {
            const payload = {
                title,
                content: content || '',
                featuredimage: featuredImage,
                status,
                userId: String(userId),
            };

            const response = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                payload
            )
            return this.mapDocument(response);
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            const response = await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage: featuredImage,
                    status,
                } 
            )
            return this.mapDocument(response);
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            throw error;
        }
    }
    
    async getPost(slug){
        try {
            const response = await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return this.mapDocument(response);
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            throw error;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                queries,
            )
            return this.mapDocuments(response);
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            // Fallback: If index on status is missing, fetch all documents directly
            if (queries && queries.length > 0) {
                console.log("Appwrite service :: getPosts :: Attempting fallback fetch without queries");
                try {
                    const response = await this.databases.listDocuments(
                        config.appwriteDatabaseId,
                        config.appwriteCollectionId,
                        []
                    )
                    return this.mapDocuments(response);
                } catch (fallbackError) {
                    console.log("Appwrite service :: getPosts fallback :: error", fallbackError);
                    throw fallbackError;
                }
            }
            throw error;
        }
    }

    //file upload services

    async uploadFile(file) {
        try {
            const uploadedFile = await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
            return uploadedFile;
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            throw error;
        }
    }

    async deleteFile(fileId){
        try {
             await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            config.appwriteBucketId,
            fileId
        );
    }
}

const service = new Service()
export default service