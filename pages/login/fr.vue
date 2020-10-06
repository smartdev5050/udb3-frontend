<template>
  <login />
</template>

<script>
  import Login from '@/components/login';

  export default {
    layout: 'login',
    components: {
      Login,
    },
    mounted() {
      this.$i18n.locale = 'fr';
      this.$cookies.set('udb-language', 'fr');
    },
  };
</script>

<style lang="scss" scoped></style>
