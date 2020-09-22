<template>
  <component :is="as" :class="className" v-bind="$attrs" v-on="$listeners" @click="handleClick">
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
    computed: {
      className() {
          return this.as === 'a' ? 'link' : '';
      }
    },
    methods: {
      handleClick() {
        this.$emit('click');
      },
    },
  };
</script>

<style lang="scss" scoped>
  a.link {
    font-weight: 400;
    color: $udb-blue;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
