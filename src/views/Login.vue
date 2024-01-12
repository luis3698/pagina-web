<template>
    <div class="background">
      <div class="context">
        <a-card class="login-card" bordered="false">
          <h1 class="text-center">Login</h1>
          <a-row class="form-container">
            <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
              <a-form
                name="basicLogin"
                autocomplete="off"
                layout="vertical"
                :model="formState"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
              >
                <a-form-item
                  name="email"
                  label="Ingresa tu correo"
                  :rules="[{ required: true, whitespace: true, message: 'Ingresa un email', type: 'email' }]"
                >
                  <a-tooltip   class="imput" placement="bottom">
                    <template #title>
                      <span>ejemplo@gmail.com.mx</span>
                    </template>
                    <a-input v-model:value="formState.email"  placeholder="Email">
                      <template #prefix>
                        <UserOutlined style="color: rgb(36,38,54)" />
                      </template>
                    </a-input>
                  </a-tooltip>
                </a-form-item>
                <a-form-item
                  name="password"
                  label="Ingrese su contraseña"
                  :rules="[{ required: true, min: 6, whitespace: true, message: 'Ingresa una contraseña ' }]"
                >
                  <a-tooltip class="imput" placement="bottom">
                    <template #title>
                      <span>Tiene que ser mínimo de 6 caracteres</span>
                    </template>
                    <a-input-password v-model:value="formState.password" placeholder="Password">
                      <template #prefix>
                        <LockOutlined style="color: rgb(36,38,54)" />
                      </template>
                    </a-input-password>
                  </a-tooltip>
                </a-form-item>
                <a-form-item class="center-button">
                  <a-button
                    class="button"
                    html-type="submit"
                    :loading="userStore.loadingUser"
                    :disabled="userStore.loadingUser || formState.email === '' || formState.password === ''"
                  >
                    Ingresar
                  </a-button>
                </a-form-item>
                <div class="additional-options">
                  <a class="forgotPassword" href="#" @click="forgotPassword">¿Olvidaste tu contraseña?</a>
                  <a href="">Inicia sesion con</a>
                  <div class="social-buttons">
                    
                      <img  :src="GoogleIcon"
                      alt="Google Icon"
                      style="cursor: pointer;"
                      @click="signInWithGoogle" />
                   
                    
                      <img :src="FacebookIcon" 
                      alt="Facebook Icon" 
                      style="cursor: pointer;" 
                      @click="signInWithFacebook" />
                   
                    
                      <img :src="MicrosoftIcon" 
                      alt="Microsoft Icon" 
                      style="cursor: pointer;" 
                      @click="signInWithMicrosoft" />
                   
                  </div>                
                </div>
              </a-form>
            </a-col>
          </a-row>
        </a-card>
      </div>
  
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import { useUserStore } from '../stores/user';
  import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, WindowsOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';

  import GoogleIcon from '../assets/icons8-logo-de-google.svg';
  import FacebookIcon from '../assets/icons8-facebook.svg';
  import MicrosoftIcon from '../assets/icons8-microsoft.svg';
  
  const userStore = useUserStore();
  const formState = reactive({
    email: '',
    password: '',
  });
  
  const onFinish = async () => {
    const result = await userStore.loginUser(formState.email, formState.password);
  
    if (!result) {
      message.success('Bienvenido');
    } else {
      handleLoginError(result);
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed: ', errorInfo);
  };
  
  const forgotPassword = () => {
    // Implementa tu lógica para manejar el olvido de la contraseña
  };
  
  const signInWithGoogle = () => {
    // Implementa tu lógica para iniciar sesión con Google
  };
  
  const signInWithFacebook = () => {
    // Implementa tu lógica para iniciar sesión con Facebook
  };
  
  const signInWithMicrosoft = () => {
    // Implementa tu lógica para iniciar sesión con Microsoft
  };
  
  const handleLoginError = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message.error('El usuario o la contraseña están incorrectos');
        break;
      default:
        message.error('Hubo un error en el servidor');
        break;
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css?family=Exo:400,700');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Exo', sans-serif;
    
    
  }
  
  .background {
    position: relative;
    overflow: hidden; /* Agrega esta línea */
  }

  
  .context {
    width: 100%;
    position: absolute;
    top: 20vh;
    z-index: 1; /* Asegura que la tarjeta esté sobre el fondo */
  }
  
  .login-card {
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .text-center {
    text-align: center;
    color: #f79f1b;
  }
  
  .form-container {
    margin-top: 20px;
  }
  
  .center-button {
    text-align: center;
   
  }
  .button{
    background-color: #f79f1b;
  }
  
  .additional-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    
  }
  .forgotPassword {
    color: #FAF0F0;
  }
  .imput{
    border-radius: 10px;
  }
  
  .social-buttons {
    display: flex;
    margin-top: 10px;
  }
  
  
  
  .area {
    background: linear-gradient(to left, #424663, #242636);
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }
  
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0; /* Asegura que los círculos estén detrás del contenido */
  }
  
  .circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: #f79f1b;
    animation: animate 25s linear infinite;
    bottom: -150px;
  }
  
  .circles li:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
  }
  
  .circles li:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
  }
  
  .circles li:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
  }
  
  .circles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
  }
  
  .circles li:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
  }
  
  .circles li:nth-child(6) {
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
  }
  
  .circles li:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
  }
  
  .circles li:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
  }
  
  .circles li:nth-child(9) {
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
  }
  
  .circles li:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
  }
  
  @keyframes animate {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
      border-radius: 0;
    }
  
    100% {
      transform: translateY(-1000px) rotate(720deg);
      opacity: 0;
      border-radius: 50%;
    }
  }
  </style>
  