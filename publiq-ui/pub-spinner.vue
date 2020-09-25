<template>
  <div class="text-center d-flex justify-content-center spinner-container">
    <b-spinner :small="size === 'small'" :variant="variant"></b-spinner>
  </div>
</template>

<script>
  export default {
    props: {
      variant: {
        type: String,
        default: 'primary',
        validator(val) {
          return ['primary', 'light'].includes(val);
        },
      },
      size: {
        type: String,
        default: 'normal',
        validator(val) {
          return ['normal', 'small'].includes(val);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .spinner-container {
    width: 100%;
  }
</style>
