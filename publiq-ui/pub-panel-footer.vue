<template>
  <section class="panel-footer">
    <slot />
  </section>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .panel-footer {
    padding: 0.75rem 1rem;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
  }
</style>
