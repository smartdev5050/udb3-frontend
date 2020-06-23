<template>
  <div>
    <div class="hero">
      <div class="container">
        <HomeSplash />
        <h1 class="brand">UiTdatabank</h1>
        <p class="lead">
          <span> Organiseer je een activiteit?</span> <br />
          <span class="muted"
            >Voeg gratis je activiteiten toe en bereik een groter publiek</span
          >
        </p>
      </div>
    </div>

    <div class="start">
      <div class="container-fluid">
        <p class="text-center">
          <a class="btn btn-lg btn-primary" @click="login">Login</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import HomeSplash from '../components/HomeSplash'
import UitidAuth from '../services/auth'
export default {
  components: { HomeSplash },
  layout: 'login',
  methods: {
    login: () => {
      const auth = new UitidAuth()
      auth.login()
    },
  },
}
</script>
