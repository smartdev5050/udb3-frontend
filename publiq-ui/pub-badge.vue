<template>
  <span class="badge">
    <slot />
  </span>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .badge {
    color: $white;
    background-color: $danger;
  }
</style>
