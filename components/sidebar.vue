<template>
  <div class="side-bar">
    <div class="sidebar">
      <logo class="logo" />
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
        <li>
          <nuxt-link to="/internal-app">internal vue</nuxt-link>
        </li>
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

      <div class="person-data">
        <ul>
          <li class="notifications">
            <a @click="toggleJobLogger">
              <fa icon="bell" />
              <job-indicator :state="jobLoggerState" />
              <span class="menu-text">Meldingen</span>
            </a>
          </li>

          <li class="hidden-xs">
            <div class="media">
              <div class="media-left">
                <!-- TODO: Get the user image -->
                <img
                  class="media-object"
                  width="50"
                  height="50"
                  :src="picture"
                />
              </div>
              <div class="media-body">
                <span class="nick">{{
                  user.nick ? user.nick : user.username
                }}</span>
                <br />
                <button-logout />
              </div>
            </div>
          </li>
        </ul>

        <!--
        <div class="visible-xs profile-pic dropup">
          <img
            class="img-responsive dropdown-toggle"
            id="logoutMenu"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
            width="50"
            height="50"
            src="images/avatar.svg"
          />
          <ul class="dropdown-menu pull-left" aria-labelledby="logoutnMenu">
            <li><a href="#" ng-click="mbc.logout()" translate-once="menu."></a></li>
          </ul>
        </div>
        -->
      </div>
    </div>

    <job-logger
      :is-open="isJobLoggerOpen"
      @close="toggleJobLogger"
      @statechange="handleStateChange"
    />
  </div>
</template>

<script>
  import {
    BIconHouseDoorFill,
    BIconPlusCircleFill,
    BIconSearch,
    BIconFlag,
  } from 'bootstrap-vue';
  import JobLogger, { JobLoggerStates } from '../components/job/job-logger';
  import ButtonLogout from './button-logout';
  import JobIndicator from './job/job-indicator';
  import Logo from './logo';

  export default {
    name: 'Sidebar',
    components: {
      BIconHouseDoorFill,
      BIconPlusCircleFill,
      BIconSearch,
      BIconFlag,
      ButtonLogout,
      JobIndicator,
      Logo,
      JobLogger,
    },
    data() {
      return {
        isJobLoggerOpen: false,
        jobLoggerState: JobLoggerStates.IDLE,
      };
    },
    computed: {
      user() {
        return this.$cookies.get('user');
      },
      picture() {
        return this.$cookies.get('userPicture');
      },
    },
    methods: {
      toggleJobLogger() {
        this.isJobLoggerOpen = !this.isJobLoggerOpen;
      },
      handleStateChange(state) {
        this.jobLoggerState = state;
      },
    },
  };
</script>

<style lang="scss">
  .sidebar {
    position: relative;
    width: 230px;
    padding: 5px;
    background-color: #c0120c;
    height: 100vh;
    color: #fff;
    text-align: left;
    z-index: 2000;
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
  .person-data {
    position: absolute;
    left: 5px;
    bottom: 5px;
    right: 5px;
  }
</style>
