import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { defineStore } from 'pinia'
import { auth, db, storage } from '../firebaseConfig';
import router from '../router';
import { useDatabaseStore } from './database'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false
    }),
    getters: {

    },
    actions: {
        async registerUser(email, password) {
            try {
                this.loadingUser = true;
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                // console.log(user);
                this.userData = {
                    email: user.email,
                    uid: user.uid
                };
                router.push('/');
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async setUser(user) {
            try {
                const docRef = doc(db, 'users', user.uid);
        
                this.userData = {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoUrl: user.photoURL,
                    biografia: '', // Puedes dejarlo vacío por defecto
                    genero: '' // Puedes dejarlo vacío por defecto
                };
        
                // Asigna los valores a biografía y género si están presentes en la base de datos
                const userDoc = await getDoc(docRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    this.userData.biografia = userData.biografia || '';
                    this.userData.genero = userData.genero || '';
                }
        
                await setDoc(docRef, this.userData);
            } catch (error) {
                console.log(error);
            }
        },
        
        
        
        async updateUser(displayName, image, { biografia, genero }) {
            try {
                if (image) {
                    this.loadingUser = true;
                    const storageRef = ref(storage, `perfiles/${this.userData.uid}`);
                    await uploadBytes(storageRef, image.originFileObj);
                    const photoURL =  await getDownloadURL(storageRef);
                    await updateProfile(auth.currentUser, {
                        photoURL,
                    }); 
                }
        
                await updateProfile(auth.currentUser, {
                    displayName,
                });
        
                // Actualizar la biografía y el género
                this.userData.biografia = biografia || '';
                this.userData.genero = genero || '';
        
                // Log para depuración
                console.log('Biografía:', this.userData.biografia);
                console.log('Género:', this.userData.genero);
        
                // Actualizar la información en Firestore
                const docRef = doc(db, 'users', auth.currentUser.uid);
                await setDoc(docRef, this.userData);
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        
        
        async loginUser(email, password) {
            try {
                this.loadingUser = true;
                const {user} = await signInWithEmailAndPassword(auth, email, password);
                await  this.setUser(user);
                router.push('/');
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async logoutUser() {
            const databaseStore = useDatabaseStore();
            databaseStore.$reset();
            try {
                this.loadingUser = true;
                await signOut(auth);
                this.userData = '';
                router.push('/login');
            } catch (error) {
                console.log(error);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async deleteUserAccount() {
            try {
                this.loadingUser = true;
                const user = auth.currentUser;
    
                // Eliminar documento de usuario en Firestore (si lo tienes)
                const userDocRef = doc(db, 'users', user.uid);
                await deleteDoc(userDocRef);
    
                // Eliminar cuenta de autenticación
                await deleteUser(auth.currentUser);
    
                // Limpiar datos locales
                this.userData = null;
    
                // Redirigir a la página de inicio de sesión
                router.push('/login');
            } catch (error) {
                console.error(error);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        await this.setUser(user);
                        console.log('Datos del usuario:', this.userData);
                    } else {
                        this.userData = null;
                        const databaseStore = useDatabaseStore();
                        databaseStore.$reset();
                    }
                    resolve(user);
                }, (e) => reject(e));
                unsuscribe();
            });
        }
        
        
        
    },
})