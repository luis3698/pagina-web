import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { defineStore } from 'pinia'
import { auth, db, storage } from '../firebaseConfig';
import router from '../router';
import { useDatabaseStore } from './database'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: {
            email: null,
            uid: null,
            displayName: null,
            photoUrl: null,
            lastName: null, // Nuevo campo para el apellido
            birthday: null, // Nuevo campo para la fecha de cumpleaños
        },
        loadingUser: false,
        loadingSession: false,
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
                    lastName: null,
                    birthday: null,
                };
        
                // Recupera el documento del usuario en Firestore para obtener datos adicionales
                const userDoc = await getDoc(docRef);
        
                if (userDoc.exists()) {
                    const userDataFromFirestore = userDoc.data();
                    this.userData.lastName = userDataFromFirestore.lastName;
                    this.userData.birthday = userDataFromFirestore.birthday;
                }
        
                // ...
            } catch (error) {
                console.log(error);
            }
        },
        
        async updateUser(displayName, lastName, birthday, image) {
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
        
                const docRef = doc(db, 'users', auth.currentUser.uid);
                await setDoc(docRef, {
                    lastName,
                    birthday,
                }, { merge: true });
        
                // Actualiza el estado local con los nuevos datos
                this.userData.displayName = displayName;
                this.userData.lastName = lastName;
                this.userData.birthday = birthday;
        
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
        currentUser() {
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, async(user) => {
                    if (user) {
                        console.log(user);
                        // await this.setUser(user)
                        this.userData = {
                            email: user.email,
                            uid: user.uid,
                            displayName: user.displayName,
                            photoUrl: user.photoURL
                        };
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
    }
})