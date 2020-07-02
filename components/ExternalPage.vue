<template>
  <iframe ref="iframe" class="external_app" :src="path"></iframe>
</template>

<script>
  const Sources = {
    UDB: 'UDB',
  }

  const MessageType = {
    URL_CHANGE: 'URL_CHANGE',
    QUERY_STRING_CHANGE: 'QUERY_STRING_CHANGE',
  }

  const changeQueryString = (queryString) =>
    history.pushState(
      undefined,
      undefined,
      `${window.location.pathname}?${queryString}`
    )

  const changeUrl = (url) => history.pushState(undefined, undefined, url)

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
          if (event.data.type === MessageType.URL_CHANGE) {
            changeUrl(event.data.path)
          }
          if (
            event.data.type === MessageType.QUERY_STRING_CHANGE &&
            event.data.queryString
          ) {
            changeQueryString(event.data.queryString)
          }
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
