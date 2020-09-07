<template>
  <li tabindex="0" class="list-group-item" @click="handleClick">
    <slot />
  </li>
</template>

<script>
  export default {
    methods: {
      handleClick() {
        this.$emit('click');
      },
    },
  };
</script>
