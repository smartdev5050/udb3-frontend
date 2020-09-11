<template>
  <a :href="href" @click="handleClick"><slot /></a>
</template>

<script>
  export default {
    props: {
      href: {
        type: String,
        default: '',
      },
    },
    methods: {
      handleClick() {
        this.$emit('click');
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
