<template>
  <iframe ref="iframe" class="external_app" :src="path"></iframe>
</template>

<script>
  export default {
    name: 'ExternalPage',
    props: {
      path: {
        type: String,
        default: '',
      },
    },
    mounted() {
      // const iframe = this.$refs.iframe.contentWindow
      window.addEventListener('message', (event) => {
        if (event.data.type === 'UDB') {
          const location = event.data.message
          history.pushState('test', 'test', location)
        }
      })
    },
  }
</script>

<style scoped>
  .external_app {
    height: 100vh;
    width: 100%;
    border: 0;
  }
</style>
