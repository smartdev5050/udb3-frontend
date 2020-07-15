<template>
  <a href="#" @click="logout">
    <b-icon-box-arrow-in-right></b-icon-box-arrow-in-right>
    Afmelden
  </a>
</template>

<script>
  import { BIconBoxArrowInRight } from 'bootstrap-vue';
  import { logout } from '../services/auth';

  export default {
    name: 'ButtonLogout',
    components: {
      BIconBoxArrowInRight,
    },
    methods: {
      logout,
    },
  };
</script>
