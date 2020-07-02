<template>
  <div class="sidebar">
    <Logo class="logo" />
    <ul>
      <li>
        <nuxt-link to="/">
          <b-icon-house-door-fill></b-icon-house-door-fill>
          <span>Home</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/event">
          <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
          <span>Invoeren</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/search">
          <b-icon-search></b-icon-search>
          <span>Zoeken</span>
        </nuxt-link>
      </li>
      <li><nuxt-link to="/internal-app">internal vue</nuxt-link></li>
    </ul>
    <div>
      <p>Beheer</p>
      <ul class="admin">
        <li>
          <nuxt-link to="/search">
            <b-icon-flag></b-icon-flag>
            <span>Valideren</span>
          </nuxt-link>
        </li>
      </ul>
    </div>
    <UserBlock />
  </div>
</template>

<script>
  import {
    BIconHouseDoorFill,
    BIconPlusCircleFill,
    BIconSearch,
    BIconFlag,
  } from 'bootstrap-vue'
  import Logo from './Logo'
  import UserBlock from './UserBlock'
  export default {
    name: 'Navbar',
    components: {
      BIconHouseDoorFill,
      BIconPlusCircleFill,
      BIconSearch,
      BIconFlag,
      Logo,
      UserBlock,
    },
  }
</script>

<style lang="scss">
  .sidebar {
    width: 230px;
    padding: 5px;
    background-color: #c0120c;
    height: 100vh;
    color: #fff;
    text-align: left;
  }
  .logo {
    margin-bottom: 10px;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  .sidebar a {
    color: #fff;
    display: inline-block;
    text-decoration: none;
    padding: 5px;
    width: 100%;
  }
  .sidebar a span {
    margin-left: 10px;
  }
  .sidebar a:hover {
    background-color: #900d09;
  }
</style>
