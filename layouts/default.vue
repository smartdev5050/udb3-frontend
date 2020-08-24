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

<style lang="scss"></style>
