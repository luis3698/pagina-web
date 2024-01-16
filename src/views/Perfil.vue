<template>
  <div class="profile-container">
    

    <div class="text-center">

      <div>
      <h1 class="text-center">{{ userStore.userData.displayName }}</h1>
</div>
      <div class="wrap">
        <div class="circle">
          <img :src="userStore.userData.photoUrl" :size="150">
        </div>
      </div>
      <div class="user-details">
        <p><strong>Biografía:</strong> {{ userStore.userData.biografia }}</p>
        <p><strong>Género:</strong> {{ userStore.userData.genero }}</p>
      </div>
    </div>

    <a-button @click="toggleForm">Mostrar/Ocultar Formulario</a-button>

    <a-row v-if="showForm">
      <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
        <a-form
          class="profile-form"
          name="basicPerfil"
          autocomplete="off"
          layout="vertical"
          :model="userStore.userData"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >  
        <!-- Subir imagen -->
          <a-form-item>
            <a-upload
              v-model:file-list="fileList"
              list-type="picture"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button>
                <UploadOutlined />
                Subir imagen
              </a-button>
            </a-upload>
          </a-form-item>

          <!-- Correo electrónico -->
          <a-form-item name="email" label="Tú correo">
            <a-input disabled v-model:value="userStore.userData.email" placeholder="Email">
              <template #prefix>
                @
              </template>
            </a-input>
          </a-form-item>

          <!-- Nombre -->
          <a-form-item
            name="displayName"
            label="Ingrese su nombre"
            :rules="[{ required: true, whitespace: true, message: 'Ingresa un nombre válido' }]"
          >
            <a-input v-model:value="userStore.userData.displayName" placeholder="Nombre">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <!-- Biografía -->
          <a-form-item name="biografia" label="Biografía">
            <a-textarea v-model:value="userStore.userData.biografia" placeholder="Escribe tu biografía"></a-textarea>
          </a-form-item>

          <!-- Género -->
          <a-form-item name="genero" label="Género">
            <a-select v-model:value="userStore.userData.genero" placeholder="Selecciona tu género">
              <a-select-option value="masculino">Masculino</a-select-option>
              <a-select-option value="femenino">Femenino</a-select-option>
              <a-select-option value="otro">Otro</a-select-option>
            </a-select>
          </a-form-item>

          <!-- Botón para actualizar información -->
          <a-form-item>
            <a-button
              class="form-button"
              type="primary"
              html-type="submit"
              :loading="userStore.loadingUser"
              :disabled="!userStore.userData.email"
            >
              Actualizar Información
            </a-button>
          </a-form-item>

          <!-- Botón para eliminar cuenta -->
          <a-button
            class="delete-account-button"
            type="danger"
            @click="confirmDeleteAccount"
            :loading="userStore.loadingUser"
            :disabled="userStore.loadingUser"
          >
            Eliminar cuenta
          </a-button>

          <!-- Modal para confirmar la eliminación de la cuenta -->
          <a-modal
            v-model:visible="modalVisible"
            title="Confirmar eliminación de cuenta"
            @ok="deleteAccount"
            @cancel="modalVisible = false"
          >
            ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
          </a-modal>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import { useUserStore } from '../stores/user';
import { UserOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const userStore = useUserStore();
const fileList = ref([]);
const modalVisible = ref(false);
const showForm = ref(false);

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const beforeUpload = (file) => {
  fileList.value = [...fileList.valuem, file];
  return false;
}

const handleRemove = file => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const handleChange = info => {
  //valida tipos de imagenes
  if (info.file.status !== 'uploading') {
      // console.log(info.file)
      const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
      if (!isJpgOrPng) {
          message.error('Solo puede ser JPG o PNG');
          handleRemove(info.file);
          return;
      }
      const isLt2M = info.file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
          message.error('Maximo 2MB!');
          handleRemove(info.file);
          return;
      }
  }
  
  //Se valida que sea una imagen pero la remplaza
  let resFileList = [...info.fileList];
  
  resFileList = resFileList.slice(-1);
  
  resFileList = resFileList.map(file => {
      if (file.response) {
          file.url = file.response.url;
      }
      return file;
  });
  fileList.value = resFileList;
};

const onFinish = async () => {
  const result = await userStore.updateUser(userStore.userData.displayName, fileList.value[0], {
    biografia: userStore.userData.biografia,
    genero: userStore.userData.genero,
  });

  if (!result) {
    console.log(userStore.userData.photoURL);
    return message.success('Se actualizó tu información');
  }
  message.error('Ocurrió un error');
};

const onFinishFailed = () => {

};

const confirmDeleteAccount = () => {
// Mostrar el modal de confirmación
modalVisible.value = true;
};

const deleteAccount = async () => {
// Ocultar el modal
modalVisible.value = false;

// Llamar a la función deleteUserAccount de useUserStore
const result = await userStore.deleteUserAccount();

// Manejar el resultado (puedes mostrar un mensaje de éxito o error)
if (!result) {
  message.success('Tu cuenta ha sido eliminada correctamente.');
} else {
  message.error('Error al eliminar la cuenta. Por favor, inténtalo de nuevo.');
}
};
</script>
<style>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  background: rgb(110, 110, 110);
  width: 200px;
  height: 200px;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  overflow: hidden;
  animation: morph 3s linear infinite;
}

.circle img {
  width: 100%;
}

@keyframes morph {
  0%, 100% {
    border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%;
  }
  34% {
    border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
  }
  67% {
    border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%;
  }
}

/* Contenedor principal */
.profile-container {
  max-width: 80%;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/* Imagen de perfil */
.circle img {
  width: 100%;
}

/* Detalles del usuario */
.user-details {
  margin-top: 20px;
  text-align: left;
}



/* Etiquetas del formulario */
.form-label {
  font-weight: bold;
  margin-bottom: 8px;
}

/* Campos de entrada del formulario */
.form-input {
  width: 100%;
  margin-bottom: 15px;
}

/* Botones del formulario */
.form-button {
  width: 100%;
  margin-top: 15px;
}

/* Botón de eliminar cuenta */
.delete-account-button {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  width: 100%;
  margin-top: 15px;
}
</style>