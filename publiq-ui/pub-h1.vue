<template>
  <h1 :class="{ title: isTitle }"><slot /></h1>
</template>

<script>
  export const Heading1Variant = {
    DEFAULT: 'default',
    TITLE: 'title',
  };

  export default {
    props: {
      variant: {
        type: String,
        default: Heading1Variant.DEFAULT,
      },
    },
    computed: {
      isTitle() {
        return this.variant === Heading1Variant.TITLE;
      },
    },
  };
</script>

<style scoped>
  h1 {
    font-weight: 300;
    font-size: 1.6rem;
    line-height: 3.74rem;
    color: #222;
  }

  .title {
    border-bottom: 1px solid #ccc;
    margin-bottom: 2rem;
  }
</style>
