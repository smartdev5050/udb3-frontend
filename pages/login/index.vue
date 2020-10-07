<template>
  <div></div>
</template>

<script>
  export default {
    layout: 'login',
    computed: {
      locale() {
        return this.$i18n.locale || 'nl';
      },
    },
    mounted() {
      this.$router.push(`/login/${this.locale}`);
    },
  };
</script>

<style lang="scss" scoped></style>
