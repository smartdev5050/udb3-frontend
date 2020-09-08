<template>
  <div class="main-container">
    <sidebar />
    <div class="content">
      <nuxt />
    </div>
  </div>
</template>

<script>
  import Sidebar from '../components/sidebar';

  export default {
    name: 'Default',
    components: {
      Sidebar,
    },
  };
</script>

<style lang="scss" scoped>
  .main-container {
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 0;
  }

  .content {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
