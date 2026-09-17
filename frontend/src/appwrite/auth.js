import config from '../config/config';
import { Client, Account, ID } from 'appwrite';

export class AuthService {
  client = new Client();
  account;

  constructor() {
    if (config.appwriteUrl && config.appwriteProjectId) {
      this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
    } else {
      console.warn(
        'Appwrite authService: VITE_APPWRITE_URL or VITE_APPWRITE_PROJECT_ID is not configured in .env'
      );
    }

    try {
      const savedSession = localStorage.getItem('appwrite_session_id');
      if (savedSession) {
        this.client.setSession(savedSession);
      }
    } catch (e) {
      console.error('Error restoring Appwrite session from localStorage', e);
    }

    this.account = new Account(this.client);
  }

  ensureSession() {
    try {
      const savedSession = localStorage.getItem('appwrite_session_id');
      if (savedSession && this.client.config?.session !== savedSession) {
        this.client.setSession(savedSession);
      }
    } catch (e) {}
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        //call another method
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log('Appwrite service :: createAccount :: error', error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);
      if (session?.$id) {
        this.client.setSession(session.$id);
        try {
          localStorage.setItem('appwrite_session_id', session.$id);
        } catch (e) {}
      }
      return session;
    } catch (error) {
      console.log('Appwrite service :: login :: error', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      this.ensureSession();
      let user = await this.account.get();
      console.log('user', user);
      return user;
    } catch (error) {
      console.log('Appwrite service :: getCurrentUser :: error', error);
      throw error;
    }
  }

  async updateName(name) {
    try {
      this.ensureSession();
      const updated = await this.account.updateName(name);
      return updated;
    } catch (error) {
      console.log('Appwrite service :: updateName :: error', error);
      throw error;
    }
  }

  async updatePrefs(prefs) {
    try {
      this.ensureSession();
      const updated = await this.account.updatePrefs(prefs);
      return updated;
    } catch (error) {
      console.log('Appwrite service :: updatePrefs :: error', error);
      throw error;
    }
  }

  async getPrefs() {
    try {
      this.ensureSession();
      return await this.account.getPrefs();
    } catch (error) {
      console.log('Appwrite service :: getPrefs :: error', error);
      return {};
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log('Appwrite service :: logout :: error', error);
    } finally {
      try {
        if (this.client.headers) {
          delete this.client.headers['X-Appwrite-Session'];
        }
        if (this.client.config) {
          this.client.config.session = '';
        }
        localStorage.removeItem('appwrite_session_id');
      } catch (e) {}
    }
  }
}

const authService = new AuthService();

export default authService;
