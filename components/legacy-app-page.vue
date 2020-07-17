<template>
  <iframe ref="iframe" class="external_app" :src="generatePath"></iframe>
</template>

<script>
  import { MessageSources, MessageTypes } from '../services/messages';

  export default {
    name: 'LegacyAppPage',
    props: {
      path: {
        type: String,
        default: '',
      },
    },
    computed: {
      generatePath() {
        return `${process.env.legacyAppUrl}${this.path ? `/${this.path}` : ''}`;
      },
    },
    mounted() {
      window.addEventListener('message', this.handleMessage);
    },
    beforeDestroy() {
      window.removeEventListener('message', this.handleMessage);
    },
    methods: {
      handleMessage(event) {
        if (event.data.source !== MessageSources.UDB) {
          return;
        }

        if (event.data.type === MessageTypes.URL_CHANGED) {
          this.changePath(event.data.path);
        }
      },
      changePath(path) {
        this.$router.push(path);
      },
    },
  };
</script>

<style scoped>
  .external_app {
    height: 100vh;
    width: 100%;
    border: 0;
  }
</style>
