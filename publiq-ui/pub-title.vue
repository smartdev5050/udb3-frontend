<template>
  <component :is="heading" :class="heading"><slot /></component>
</template>

<script>
  export default {
    props: {
      size: {
        type: Number,
        default: 2,
        validator(val) {
          return [1, 2].includes(val);
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
  .h1 {
    font-weight: 300;
    font-size: 1.6rem;
    margin: 0;
  }

  .h2 {
    font-weight: 700;
    font-size: 1.2rem;
    margin: 0;
  }
</style>
