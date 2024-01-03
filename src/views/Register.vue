<template>
    <div class="register-container">
      <h1 class="text-center">Registro</h1>
      <a-row>
        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
          <a-form
            name="basicLogin"
            autocomplete="off"
            layout="vertical"
            :model="formState"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
          >
            <!-- Email -->
            <a-form-item
              name="email"
              label="Ingresa tu correo"
              :rules="[{ required: true, whitespace: true, message: 'Ingresa un email', type: 'email' }]"
            >
              <a-tooltip placement="bottom">
                <template #title>
                  <span>j********@gmail.com.mx</span>
                </template>
                <a-input v-model:value="formState.email" placeholder="Email">
                  <template #prefix>
                    <UserOutlined style="color: rgba(0,0,0,0.25)" />
                  </template>
                </a-input>
              </a-tooltip>
            </a-form-item>
  
            <!-- Contraseña -->
            <a-form-item
              name="password"
              label="Ingrese su contraseña"
              :rules="[{ required: true, min: 6, whitespace: true, message: 'Ingresa una contraseña ' }]"
            >
              <a-tooltip placement="bottom">
                <template #title>
                  <span>Tiene que ser mínimo de 6 caracteres</span>
                </template>
                <a-input-password v-model:value="formState.password" placeholder="Password">
                  <template #prefix>
                    <LockOutlined style="color: rgba(0,0,0,0.25)" />
                  </template>
                </a-input-password>
              </a-tooltip>
            </a-form-item>
  
            <!-- Confirmar Contraseña -->
            <a-form-item name="confirmPassword" label="Confirmar contraseña" :rules="[{ validator: validatePass }]">
              <a-input-password v-model:value="formState.confirmPassword" placeholder="Password">
                <template #prefix>
                  <LockOutlined style="color: rgba(0,0,0,0.25)" />
                </template>
              </a-input-password>
            </a-form-item>
  
            <!-- Botón de Registro -->
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :disabled="
                  userStore.loadingUser ||
                  formState.email === '' ||
                  formState.password === '' ||
                  formState.confirmPassword === '' ||
                  formState.confirmPassword !== formState.password
                "
              >
                Registrar
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import { useUserStore } from '../stores/user';
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  
  const userStore = useUserStore();
  const formState = reactive({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const validatePass = async (_rule, value) => {
    if (value === '') {
      return Promise.reject('Repita contraseña');
    }
    if (value !== formState.password) {
      return Promise.reject('No coinciden las contraseñas');
    }
    return Promise.resolve();
  };
  
  const onFinish = async (value) => {
    console.log('Success: ', value);
    const respuesta = await userStore.registerUser(formState.email, formState.password);
  
    if (!respuesta) {
      return message.success('Correo ya registrado, Bienvenido');
    }
  
    switch (respuesta) {
      case 'auth/email-already-in-use':
        message.error('El usuario ya existe');
        break;
      default:
        message.error('Hubo un error en el servidor ');
        break;
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed: ', errorInfo);
  };
  </script>
  
  <style scoped>
  /* Estilos para la vista de Registro */
  .register-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .text-center {
    text-align: center;
  }
  </style>
  