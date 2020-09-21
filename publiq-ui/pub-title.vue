<template>
  <component :is="heading"><slot /></component>
</template>

<script>
  export default {
    props: {
      size: {
        type: Number,
        default: 2,
        validator(val) {
          return [1, 2, 3, 4].includes(val);
        },
      },
    },
    computed: {
      heading() {
        return `h${this.size}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  // nearly the same as pub-page-title
  h1 {
    font-weight: 300;
    font-size: 1.6rem;
  }

  h2 {
    font-weight: 700;
    font-size: 1.2rem;
  }
</style>
