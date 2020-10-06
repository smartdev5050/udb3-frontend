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
      this.$i18n.locale = 'nl';
      this.$cookies.set('udb-language', 'nl');
    },
  };
</script>

<style lang="scss" scoped></style>
