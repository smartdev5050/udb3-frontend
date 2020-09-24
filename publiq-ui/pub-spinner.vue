<template>
  <div class="text-center d-flex justify-content-center spinner-container">
    <b-spinner :small="isInButtonVariant" :variant="mappedVariant"></b-spinner>
  </div>
</template>

<script>
  const SpinnerVariant = {
    onPage: 'primary',
    inButton: 'light',
  };

  export default {
    props: {
      variant: {
        type: String,
        default: 'onPage',
        validator(val) {
          return ['onPage', 'inButton'].includes(val);
        },
      },
    },
    computed: {
      mappedVariant() {
        return SpinnerVariant[this.variant] || SpinnerVariant.onPage;
      },
      isInButtonVariant() {
        return this.mappedVariant === SpinnerVariant.inButton;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .spinner-container {
    width: 100%;
  }
</style>
