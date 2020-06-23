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
    setTimeout(() => {
      const iframe = this.$refs.iframe.contentWindow
      console.log('iframe', iframe)
      iframe.postMessage('hello', '*')
    }, 2000)
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
