<template>
  <iframe ref="iframe" class="external_app" :src="path"></iframe>
</template>

<script>
  const Sources = {
    UDB: 'UDB',
  };

  const MessageType = {
    URL_CHANGED: 'URL_CHANGED',
  };

  const changeUrl = (url) => history.pushState(undefined, undefined, url);

  export default {
    name: 'ExternalPage',
    props: {
      path: {
        type: String,
        default: '',
      },
    },
    mounted() {
      window.addEventListener('message', (event) => {
        if (event.data.source === Sources.UDB) {
          if (event.data.type === MessageType.URL_CHANGED) {
            changeUrl(event.data.path);
          }
        }
      });
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
