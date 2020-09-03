<template>
  <h1 :class="{ title: isTitle }"><slot /></h1>
</template>

<script>
  export const HeadingVariant = {
    DEFAULT: 'default',
    TITLE: 'title',
  };

  export default {
    props: {
      variant: {
        type: String,
        default: HeadingVariant.DEFAULT,
      },
    },
    computed: {
      isTitle() {
        return this.variant === HeadingVariant.TITLE;
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
