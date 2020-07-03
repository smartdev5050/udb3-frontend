<template>
  <iframe ref="iframe" class="external_app" :src="generatePath"></iframe>
</template>

<script>
  const Sources = {
    UDB: 'UDB',
  };

  const MessageType = {
    URL_CHANGED: 'URL_CHANGED',
  };

  export default {
    name: 'ExternalPage',
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
        if (event.data.source === Sources.UDB) {
          if (event.data.type === MessageType.URL_CHANGED) {
            this.changeUrl(event.data.path);
          }
        }
      },
      changeUrl(url) {
        history.pushState(undefined, undefined, url);
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
