<template>
  <div class="side-bar">
    <div class="sidebar">
      <nuxt-link class="logo-link" to="/dashboard">
        <logo class="logo" />
      </nuxt-link>
      <ul>
        <li>
          <nuxt-link to="/dashboard">
            <fa icon="home" />
            <span>{{ $t('menu.home') }}</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/event">
            <fa icon="plus-circle" />
            <span>{{ $t('menu.add') }}</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/search">
            <fa icon="search" />
            <span>{{ $t('menu.search') }}</span>
          </nuxt-link>
        </li>
      </ul>
      <div v-if="showExtraMenuItems">
        <p>{{ $t('menu.management') }}</p>
        <ul class="admin">
          <li v-if="isValidateVisible">
            <nuxt-link to="/search">
              <fa icon="flag" />
              <span>{{ $t('menu.validate') }}</span>
            </nuxt-link>
          </li>
          <li v-if="isUsersVisible">
            <nuxt-link to="/manage/users/overview">
              <fa icon="user" />
              <span>{{ $t('menu.users') }}</span>
            </nuxt-link>
          </li>
          <li v-if="isRolesVisible">
            <nuxt-link to="/manage/roles/overview">
              <fa icon="users" />
              <span>{{ $t('menu.roles') }}</span>
            </nuxt-link>
          </li>
          <li v-if="isLabelsVisible">
            <nuxt-link to="/manage/labels/overview">
              <fa icon="tag" />
              <span>{{ $t('menu.labels') }}</span>
            </nuxt-link>
          </li>
          <li v-if="isOrganisationsVisible">
            <nuxt-link to="/manage/organizations">
              <fa :icon="['fab', 'slideshare']" />
              <span>{{ $t('menu.organizations') }}</span>
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
              <span class="menu-text">{{ $t('menu.notifications') }}</span>
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
                <span class="nick">
                  {{ user.nick ? user.nick : user.username }}
                </span>
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
  import JobLogger, { JobLoggerStates } from '../components/job/job-logger';
  import ButtonLogout from './button-logout';
  import JobIndicator from './job/job-indicator';
  import Logo from './logo';

  const Permissions = {
    AANBOD_BEWERKEN: 'AANBOD_BEWERKEN',
    AANBOD_MODEREREN: 'AANBOD_MODEREREN',
    AANBOD_VERWIJDEREN: 'AANBOD_VERWIJDEREN',
    ORGANISATIES_BEWERKEN: 'ORGANISATIES_BEWERKEN',
    ORGANISATIES_BEHEREN: 'ORGANISATIES_BEHEREN',
    GEBRUIKERS_BEHEREN: 'GEBRUIKERS_BEHEREN',
    LABELS_BEHEREN: 'LABELS_BEHEREN',
    VOORZIENINGEN_BEWERKEN: 'VOORZIENINGEN_BEWERKEN',
    PRODUCTIES_AANMAKEN: 'PRODUCTIES_AANMAKEN',
  };

  export default {
    name: 'Sidebar',
    components: {
      ButtonLogout,
      JobIndicator,
      Logo,
      JobLogger,
    },
    data() {
      return {
        isJobLoggerOpen: false,
        jobLoggerState: JobLoggerStates.IDLE,
        permissions: [],
        roles: [],
      };
    },
    computed: {
      isValidateVisible() {
        return this.roles.some((role) =>
          role.permissions.includes(Permissions.AANBOD_MODEREREN),
        );
      },
      isUsersVisible() {
        return this.permissions.includes(Permissions.GEBRUIKERS_BEHEREN);
      },
      isRolesVisible() {
        return this.permissions.includes(Permissions.GEBRUIKERS_BEHEREN);
      },
      isLabelsVisible() {
        return this.permissions.includes(Permissions.LABELS_BEHEREN);
      },
      isOrganisationsVisible() {
        return this.permissions.includes(Permissions.ORGANISATIES_BEHEREN);
      },
      showExtraMenuItems() {
        return [
          this.isValidateVisible,
          this.isUsersVisible,
          this.isRolesVisible,
          this.isLabelsVisible,
          this.isOrganisationsVisible,
        ].includes(true);
      },
      token() {
        return this.$cookies.get('token');
      },
      user() {
        return this.$cookies.get('user');
      },
      picture() {
        return this.$cookies.get('userPicture');
      },
    },
    async mounted() {
      const permissions = await this.$api.user.getPermissions();
      const roles = await this.$api.user.getRoles();
      this.permissions = permissions;
      this.roles = roles;
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
    width: 220px;
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
  .sidebar a:hover:not(.logo-link) {
    background-color: #900d09;
    color: $white;
    text-decoration: none;
  }
  .person-data {
    position: absolute;
    left: 5px;
    bottom: 5px;
    right: 5px;
  }
</style>
