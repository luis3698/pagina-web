//database.js
// Importaciones
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { defineStore } from 'pinia';
import { db, storage } from '../firebaseConfig';
import { auth } from '../firebaseConfig';
import { nanoid } from 'nanoid'
import router from '../router';
import { reactive } from 'vue';  // Importa la función reactive de Vue.js

// Definición del almacén
export const useDatabaseStore = defineStore('database', {
    state: () => ({
        documents: [],
        loadingDoc: false,
        loading: false
    }),
    actions: {

         //función para realizar la búsqueda en el almacén
        searchRecipesInStore(term) {
            const lowerCaseTerm = term.toLowerCase();
            return this.documents.filter(recipe => recipe.name.toLowerCase().includes(lowerCaseTerm));
        },
        // Función para agregar una receta con imagen
        async addNombreRWithImage(name, descripcionR, ingredientes, imageFile) {
            this.loading = true;
            try {
                // Genera un nombre único para la imagen
                const imageRef = ref(storage, `images/${nanoid(10)}`);
                // Sube la imagen al almacenamiento
                await uploadBytes(imageRef, imageFile);

                // Obtiene la URL de la imagen
                const imageUrl = await getDownloadURL(imageRef);

                // Objeto de la receta
                const objectDoc = reactive({
                    name,
                    descripcionR,
                    ingredientes,
                    imageUrl,
                    short: nanoid(6),
                    user: auth.currentUser.uid,
                    likes: []  // Inicializa likes como un array vacío
                });

                // Almacena la receta en la base de datos
                await setDoc(doc(db, "nombreRs", objectDoc.short), objectDoc);
                // Actualiza el estado del almacén con la nueva receta
                this.documents.push({
                    ...objectDoc,
                    id: objectDoc.short
                });
            } catch (error) {
                // Manejo de errores
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        // Función para actualizar una receta con imagen
        async updateNombreRWithImage(id, name, descripcionR, ingredientes, imageFile) {
            this.loading = true;
            try {
                // Referencia a la imagen en el almacenamiento
                const imageRef = ref(storage, `images/${id}`);
                // Sube la nueva imagen al almacenamiento
                await uploadBytes(imageRef, imageFile);

                // Obtiene la URL de la nueva imagen
                const imageUrl = await getDownloadURL(imageRef);

                // Referencia al documento de la receta en la base de datos
                const docRef = doc(db, 'nombreRs', id);

                // Obtiene el documento existente
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                // Verifica si el usuario tiene permisos para actualizar
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("Este documento no se puede actualizar");
                }

                // Actualiza el documento en la base de datos
                await updateDoc(docRef, {
                    name,
                    descripcionR,
                    ingredientes,
                    imageUrl  // Actualiza la URL de la imagen en la receta
                });
                // Actualiza el estado del almacén con la receta actualizada
                this.documents = this.documents.map((item) => item.id === id ? ({ ...item, name, descripcionR, ingredientes, imageUrl }): item);
                // Redirige a la página principal
                router.push('/');
            } catch (error) {
                // Manejo de errores
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        // Función para obtener una receta por su ID
        async getNombreR(id) {
            try {
                // Referencia al documento de la receta en la base de datos
                const docRef = doc(db, "nombreRs", id);
                // Obtiene el documento
                const docSnap = await getDoc(docRef);

                // Verifica si el documento existe
                if (!docSnap.exists()) {
                    return false;
                }

                // Retorna los datos de la receta
                return docSnap.data();
            } catch (error) {
                // Manejo de errores
                console.log(error.code);
                return false;
            } finally {
                // Acciones adicionales después de la operación
            }
        },
        // Función para obtener todas las recetas del usuario actual
        async getNombreRs() {
            // Verifica si ya se cargaron las recetas
            if (this.documents.length !== 0) {
                return;
            }

            this.loadingDoc = true;
            try {
                // Consulta para obtener las recetas del usuario actual
                const q = query(collection(db, 'nombreRs'), where("user", "==", auth.currentUser.uid));

                // Obtiene los documentos
                const querySnapShot = await getDocs(q);
                // Mapea los documentos y los agrega al estado del almacén
                querySnapShot.forEach(doc => {
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
            } catch (error) {
                // Manejo de errores
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingDoc = false;
            }
        },
        // Función para leer una receta por su ID
        async leerNombreR(id) {
            try {
                // Referencia al documento de la receta en la base de datos
                const docRef = doc(db, "nombreRs", id);
                // Obtiene el documento
                const docSnap = await getDoc(docRef);

                // Verifica si el documento existe
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                // Verifica si el usuario tiene permisos para editar
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No puede ser editado");
                }

                // Retorna los datos de la receta
                return docSnap.data();
            } catch (error) {
                // Manejo de errores
                console.log(error.code);
                return error.code;
            } finally {
                // Acciones adicionales después de la operación
            }
        },
        // Función para eliminar una receta
        async deleteNombreR(id) {
            try {
                this.loading = true;
                // Referencia al documento de la receta en la base de datos
                const docRef = doc(db, "nombreRs", id);

                // Obtiene el documento existente
                const docSnap = await getDoc(docRef);

                // Verifica si el documento existe
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                // Verifica si el usuario tiene permisos para eliminar
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No puede ser eliminado");
                }

                // Elimina el documento de la base de datos
                await deleteDoc(docRef);
                // Actualiza el estado del almacén eliminando la receta
                this.documents = this.documents.filter(item => item.id !== id);
            } catch (error) {
                // Manejo de errores
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        // Función para obtener todas las recetas (de todos los usuarios)
        async getAllNombreRs() {
            this.loadingDoc = true;
            try {
                // Consulta para obtener todas las recetas
                const q = query(collection(db, 'nombreRs'));
                // Obtiene los documentos
                const querySnapShot = await getDocs(q);
                // Mapea los documentos y los agrega al estado del almacén
                this.documents = querySnapShot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                // Manejo de errores
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingDoc = false;
            }
        },
         // Función para obtener información de un usuario por su ID
        async getUserById(userId) {
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    return userDocSnap.data();
                } else {
                    throw new Error('No existe el usuario');
                }
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
                throw error;
            }
        },
         // Función para manejar el me gusta de una receta
         async toggleLike(id) {
            try {
                const docRef = doc(db, 'nombreRs', id);
                const docSnap = await getDoc(docRef);
        
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
        
                const userId = auth.currentUser.uid;
                const likes = docSnap.data().likes || [];
        
                if (likes.includes(userId)) {
                    // Quitar el me gusta
                    const updatedLikes = likes.filter(user => user !== userId);
                    await updateDoc(docRef, { likes: updatedLikes });
                    // Actualiza localmente la propiedad likes de la receta
                    this.documents = this.documents.map(item => (item.id === id ? { ...item, likes: updatedLikes } : item));
                } else {
                    // Dar me gusta
                    const updatedLikes = [...likes, userId];
                    await updateDoc(docRef, { likes: updatedLikes });
                    // Actualiza localmente la propiedad likes de la receta
                    this.documents = this.documents.map(item => (item.id === id ? { ...item, likes: updatedLikes } : item));
                }
            } catch (error) {
                console.error('Error al manejar el me gusta:', error);
                return error.code;
            }
        },
         // Función para agregar un comentario a una receta
         async addComment(id, texto) {
            try {
                const docRef = doc(db, 'nombreRs', id);
                const docSnap = await getDoc(docRef);
        
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
        
                const userId = auth.currentUser.uid;
                const comentarios = docSnap.data().comentarios || [];
        
                // Obtén la información del usuario actual
                const usuarioActual = await this.getUserById(userId);
        
                // Agregar el nuevo comentario con información del usuario
                const nuevoComentario = {
                    usuario: {
                        userId: userId,
                        displayName: usuarioActual.displayName,
                        photoUrl: usuarioActual.photoUrl,
                    },
                    texto,
                };
        
                await updateDoc(docRef, { comentarios: [...comentarios, nuevoComentario] });
        
                // Actualiza localmente la propiedad comentarios de la receta
                this.documents = this.documents.map(item => (item.id === id ? { ...item, comentarios: [...comentarios, nuevoComentario] } : item));
            } catch (error) {
                console.error('Error al agregar el comentario:', error);
                return error.code;
            }
        },
        
        
    },
});
