<template>
  <component :is="as" v-bind="$attrs" v-on="$listeners" @click="handleClick">
    <slot />
  </component>
</template>

<script>
  export default {
    props: {
      as: {
        type: [String, Object],
        default: 'a',
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
