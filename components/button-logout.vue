<template>
  <a href="#" @click="logout">
    <fa icon="sign-out-alt" />
    {{ $t('menu.logout') }}
  </a>
</template>

<script>
  import { logout } from '../services/auth';

  export default {
    name: 'ButtonLogout',
    methods: {
      logout() {
        logout(this.$config.authUrl);
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    padding-left: 0 !important;
  }
</style>
