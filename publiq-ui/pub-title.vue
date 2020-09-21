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
  * {
    margin: 0;
  }

  h1 {
    font-weight: 300;
    font-size: 1.6rem;
  }

  h2 {
    font-weight: 700;
    font-size: 1.2rem;
  }
</style>
