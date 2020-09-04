<template>
  <div class="panel">
    <slot />
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .panel {
    border: 1px solid #ddd;
    margin-bottom: 1rem;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }
</style>
