<template>
  <label :for="id"><slot /></label>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default: '',
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  label {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0;
  }
</style>
