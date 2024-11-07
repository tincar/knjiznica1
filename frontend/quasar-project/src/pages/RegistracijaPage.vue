<template>
  <q-page padding>
    <!-- Naslov i opis -->
    <h5>Registracija</h5>
    <p>Postani naš član, registriraj se!</p>

    <!-- Formu za registraciju -->
    <q-form @submit.prevent="submitRegistration">
      
      <!-- Input za korisničko ime -->
      <q-input 
        v-model="form.username"
        label="Korisničko ime"
        filled
        required
        :rules="[ val => val && val.length > 0 || 'Unesite korisničko ime' ]"
        class="q-mb-md"
      />

      <!-- Input za e-mail -->
      <q-input 
        v-model="form.email"
        label="E-mail"
        type="email"
        filled
        required
        :rules="[ val => val && val.length > 0 || 'Unesite e-mail' ]"
        class="q-mb-md"
      />

      <!-- Input za lozinku -->
      <q-input 
        v-model="form.password"
        label="Lozinka"
        type="password"
        filled
        required
        :rules="[ val => val && val.length >= 6 || 'Lozinka mora biti barem 6 znakova' ]"
        class="q-mb-md"
      />

      <!-- Input za potvrdu lozinke -->
      <q-input 
        v-model="form.confirmPassword"
        label="Potvrdi lozinku"
        type="password"
        filled
        required
        :rules="[ val => val && val === form.password || 'Lozinke se moraju slagati' ]"
        class="q-mb-md"
      />

      <!-- Input za ime -->
      <q-input 
        v-model="form.firstName"
        label="Ime"
        filled
        required
        :rules="[ val => val && val.length > 0 || 'Unesite ime' ]"
        class="q-mb-md"
      />

      <!-- Input za prezime -->
      <q-input 
        v-model="form.lastName"
        label="Prezime"
        filled
        required
        :rules="[ val => val && val.length > 0 || 'Unesite prezime' ]"
        class="q-mb-md"
      />

      <!-- Gumb Potvrdi -->
      <q-btn label="Potvrdi" type="submit" color="primary" class="full-width" />
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'RegistrationPage',
  data() {
    return {
     
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      }
    };
  },
  methods: {
    
    submitRegistration() {
      // Provjera da li su svi podaci ispravno uneseni
      if (this.$refs.form.validate()) {
        // Ovdje bi išao API poziv za slanje podataka na server
        this.$q.notify({
          type: 'positive',
          message: 'Uspješno ste se registrirali!',
        });
        // Resetiranje forme nakon uspješne registracije
        this.$reset();
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Molimo vas ispunite sva polja ispravno.',
        });
      }
    }
  }
};
</script>

<style scoped>

</style>

