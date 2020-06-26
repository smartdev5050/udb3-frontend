<template>
  <div class="wrapper">
    <ExternalPage path="http://localhost:9999/" />
  </div>
</template>

<script>
  import ExternalPage from '../components/ExternalPage'
  export default {
    components: { ExternalPage },
  }
</script>

<style>
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
