<template>
  <div class="container">
    <ExternalPage path="https://epic-kepler-f11293.netlify.app/red/" />
  </div>
</template>

<script>
import ExternalPage from '../components/ExternalPage'
export default {
  components: { ExternalPage },
}
</script>

<style>
.container {
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
