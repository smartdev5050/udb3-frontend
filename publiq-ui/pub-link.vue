<template>
  <component :is="as" :class="pub-link" v-bind="$attrs" v-on="$listeners" @click="handleClick">
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
  a.pub-link {
    font-weight: 400;
    color: $udb-blue;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
