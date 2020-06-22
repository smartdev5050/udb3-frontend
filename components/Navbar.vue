<template>
  <div class="sidebar">
    <ul>
      <li><nuxt-link to="/internal-app">vue</nuxt-link></li>
      <li><nuxt-link to="/external-app">angular</nuxt-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: yellow;
  height: 100%;
}
</style>
