<template>
  <div class="main-container">
    <div class="side-bar">
      <sidebar />
      <job-logger :is-open="isJobLoggerOpen" @close="handleJobLoggerClose" />
    </div>
    <div class="content">
      <nuxt />
    </div>
  </div>
</template>

<script>
  import Sidebar from '../components/sidebar';
  import JobLogger from '../components/job/job-logger';

  export default {
    components: {
      Sidebar,
      JobLogger,
    },
    data() {
      return {
        isJobLoggerOpen: true,
      };
    },
    methods: {
      handleJobLoggerClose() {
        this.isJobLoggerOpen = false;
      },
    },
  };
</script>

<style>
  .main-container {
    display: flex;
    flex-direction: row;
  }
  .content {
    flex: 1;
  }
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }
</style>
