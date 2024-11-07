<template>
  <q-page padding>
    <h5>Logiraj se</h5>
    <p>Ulogiraj se ako već imaš postojeći account.</p>

    
    <q-input
      filled
      label="Korisničko ime"
      type="text"
      id="username"
      placeholder="Unesite korisničko ime"
    ></q-input>

   
    <q-input
      filled
      label="Lozinka"
      type="password"
      id="password"
      placeholder="Unesite lozinku"
    ></q-input>

    
    <q-btn label="Potvrdi" color="primary" @click="showMessage"></q-btn>

    
    <div id="message" style="display: none; color: green; text-align: center; margin-top: 20px;">
      Logirani ste!
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const showMessage = () => {
  const message = document.getElementById('message');
  message.style.display = 'block';
};
</script>


  


<script>
export default {
  // name: 'PageName',
}
</script>
