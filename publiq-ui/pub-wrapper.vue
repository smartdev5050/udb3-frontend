<template>
  <div class="wrapper"><slot /></div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .wrapper {
    background-color: #f0f0f0;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: left;
    align-items: flex-start;
    text-align: left;
  }
</style>
