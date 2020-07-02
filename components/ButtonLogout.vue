<template>
  <a href="#" @click="logout">
    <b-icon-box-arrow-in-right></b-icon-box-arrow-in-right>
    Afmelden
  </a>
</template>

<script>
  import { BIconBoxArrowInRight } from 'bootstrap-vue'
  export default {
    components: {
      BIconBoxArrowInRight,
    },
    methods: {
      logout() {
        this.$cookies.remove('user')
        this.$cookies.remove('token')
        this.$cookies.remove('userPicture')
        // Redirect go login
        this.$router.push({
          path: '/login',
        })
      },
    },
  }
</script>
