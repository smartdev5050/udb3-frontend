<template>
  <div class="wrapper">
    <ExternalPage path="http://localhost:9999/event" />
  </div>
</template>

<script>
import ExternalPage from '../components/ExternalPage'
export default {
  components: { ExternalPage },
}
</script>

<style>
.wrapper {
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
