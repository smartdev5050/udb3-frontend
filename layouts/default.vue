<template>
  <div class="main-container">
    <sidebar />
    <giftbox />
    <div class="content">
      <nuxt />
    </div>
  </div>
</template>

<script>
  import Sidebar from '../components/sidebar';
  import Giftbox from '../components/giftbox';

  export default {
    name: 'Default',
    components: {
      Sidebar,
      Giftbox,
    },
  };
</script>

<style>
  @import url('//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,300,400,700,600');
  .main-container {
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 0;
  }
  .content {
    flex: 1;
  }
  html {
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }
  body {
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #222;
    background-color: #f0f0f0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }
</style>
