<template>
  <component :is="as" v-bind="$attrs" v-on="$listeners" @click="handleClick">
    <slot />
  </component>
</template>

<script>
  import PubButton from './pub-button';

  export const SupportedTypes = ['a', 'nuxt-link', 'pub-button'];

  export default {
    components: {
      PubButton,
    },
    props: {
      as: {
        type: String,
        default: 'a',
        validator(value) {
          return SupportedTypes.includes(value);
        },
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
