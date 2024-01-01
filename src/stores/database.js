// Importaciones
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { defineStore } from 'pinia';
import { db, storage } from '../firebaseConfig';  // Asegúrate de importar el objeto 'storage' desde firebaseConfig
import { auth } from '../firebaseConfig';
import { nanoid } from 'nanoid'
import router from '../router';

// Definición del almacén
export const useDatabaseStore = defineStore('database', {
    state: () => ({
        documents: [],
        loadingDoc: false,
        loading: false
    }),
    actions: {
        async addNombreRWithImage(name, descripcionR, ingredientes, imageFile) {
            this.loading = true;
            try {
                const imageRef = ref(storage, `images/${nanoid(10)}`);  // Genera un nombre único para la imagen
                await uploadBytes(imageRef, imageFile);

                const imageUrl = await getDownloadURL(imageRef);

                const objectDoc = {
                    name,
                    descripcionR,
                    ingredientes,
                    imageUrl,  // Agrega la URL de la imagen a la receta
                    short: nanoid(6),
                    user: auth.currentUser.uid
                }

                await setDoc(doc(db, "nombreRs", objectDoc.short), objectDoc);
                this.documents.push({
                    ...objectDoc,
                    id: objectDoc.short
                });
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        async updateNombreRWithImage(id, name, descripcionR, ingredientes, imageFile) {
            this.loading = true;
            try {
                const imageRef = ref(storage, `images/${id}`);
                await uploadBytes(imageRef, imageFile);

                const imageUrl = await getDownloadURL(imageRef);

                const docRef = doc(db, 'nombreRs', id);

                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("Este documento no se puede actualizar");
                }

                await updateDoc(docRef, {
                    name,
                    descripcionR,
                    ingredientes,
                    imageUrl  // Actualiza la URL de la imagen en la receta
                });
                this.documents = this.documents.map((item) => item.id === id ? ({ ...item, name, descripcionR, ingredientes, imageUrl }): item);
                router.push('/');
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        async getNombreR(id) {
            try {
                const docRef = doc(db, "nombreRs", id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    return false;
                }

                return docSnap.data();
            } catch (error) {
                console.log(error.code);
                return false;
            } finally {
                // Acciones adicionales después de la operación
            }
        },
        async getNombreRs() {
            if (this.documents.length !== 0) {
                return;
            }
            this.loadingDoc = true;
            try {
                const q = query(collection(db, 'nombreRs'), where("user", "==", auth.currentUser.uid));

                const querySnapShot = await getDocs(q);
                querySnapShot.forEach(doc => {
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingDoc = false;
            }
        },
        async addNombreR(name, descripcionR, ingredientes) {
            this.loading = true;
            try {
                const objectDoc = {
                    name,
                    descripcionR,
                    ingredientes,
                    short: nanoid(6),
                    user: auth.currentUser.uid
                }
                await setDoc(doc(db, "nombreRs", objectDoc.short), objectDoc);
                this.documents.push({
                    ...objectDoc,
                    id: objectDoc.short
                });
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        async leerNombreR(id) {
            try {
                const docRef = doc(db, "nombreRs", id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No puede ser editado");
                }

                return docSnap.data();
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                // Acciones adicionales después de la operación
            }
        },
        async updateNombreR(id, name, descripcionR, ingredientes) {
            this.loading = true;
            try {
                const docRef = doc(db, 'nombreRs', id);

                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("Este documento no se puede actualizar");
                }

                await updateDoc(docRef, {
                    name,
                    descripcionR,
                    ingredientes
                });
                this.documents = this.documents.map((item) => item.id === id ? ({ ...item, name, descripcionR, ingredientes }): item);
                router.push('/');
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        async deleteNombreR(id) {
            try {
                this.loading = true;
                const docRef = doc(db, "nombreRs", id);

                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No puede ser eliminado");
                }

                await deleteDoc(docRef);
                this.documents = this.documents.filter(item => item.id !== id);
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        async getAllNombreRs() {
            this.loadingDoc = true;
            try {
                const q = query(collection(db, 'nombreRs'));
                const querySnapShot = await getDocs(q);
                this.documents = querySnapShot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingDoc = false;
            }
        },
    },
    
});
