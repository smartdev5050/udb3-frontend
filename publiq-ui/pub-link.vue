<template>
  <a :href="href"><slot /></a>
</template>

<script>
  export default {
    props: {
      href: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    font-weight: 400;
    color: $udb-blue;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
