<template>
  <div class="side-bar">
    <div class="sidebar">
      <nuxt-link class="udb-logo-link" to="/dashboard">
        <img src="" alt="logo Uitdatabank" class="udb-logo" />
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
      <div v-if="showExtraMenuItems" class="management-block">
        <p class="management-title">{{ $t('menu.management') }}</p>
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
            <a class="notification-container" @click="toggleJobLogger">
              <div>
                <fa icon="bell" />
                <span>{{ $t('menu.notifications') }}</span>
              </div>
              <job-indicator :state="jobLoggerState" />
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
      isJobLoggerStateIdle() {
        return this.jobLoggerState === JobLoggerStates.IDLE;
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
        return (
          this.$cookies.get('userPicture') || require('../assets/avatar.svg')
        );
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
  $sidebar-width: 230px;
  $sidebar-mobile-width: 65px;
  $padding-normal: 5px;
  $padding-small: 3px;

  .sidebar {
    position: relative;
    width: $sidebar-width;
    padding: $padding-normal;
    background-color: #c0120c;
    height: 100vh;
    color: #fff;
    text-align: left;
    z-index: 2000;

    .udb-logo {
      background-image: url(../assets/udb-logo.svg);
      background-repeat: no-repeat;
      background-position: center;
      display: block;
      width: 220px;
      height: 40px;
      margin-bottom: 10px;
    }

    .udb-logo-link {
      color: transparent;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    a:not(.udb-logo-link) {
      line-height: 1.6rem;
      color: #fff;
      display: inline-block;
      text-decoration: none;
      padding: $padding-normal;
      width: 100%;
      font-weight: 600;
    }

    svg:not(:root).svg-inline--fa {
      overflow: visible;
      width: 1rem;
      height: 1rem;
    }

    a span {
      margin-left: 6px;
    }

    a:hover:not(.udb-logo-link) {
      background-color: #900d09;
      color: $white;
      text-decoration: none;
      cursor: pointer;
    }

    .management-block {
      margin-top: 0.8rem;
      border-top: 1px solid #900d09;

      .management-title {
        font-size: small;
        font-weight: normal;
        text-transform: uppercase;
        display: block;
        margin: 5px 0;
        opacity: 0.5;
      }
    }

    .notifications {
      border-bottom: 1px solid #900d09;
      margin-bottom: 10px;

      .notification-container {
        display: inline-flex;
        justify-content: space-between;
      }

      .indicator {
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
      }
    }

    .person-data {
      position: absolute;
      right: 5px;
      bottom: 5px;
      left: 5px;
    }

    .media {
      .media-left {
        padding-right: 10px;
      }
    }
  }

  @media (max-width: 767px) {
    .sidebar {
      width: $sidebar-mobile-width;
      padding: 0;

      a:not(.udb-logo-link) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 0.6rem;
        padding: $padding-small;
        width: 100%;
        text-align: center;
      }

      a span {
        margin-left: 0;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .udb-logo {
        background-image: url(../assets/udb-logo-mobile.svg);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
        display: block;
        width: 50px;
        height: 50px;
        margin: 0 auto 16px auto;
      }

      .management-title {
        text-align: center;
      }

      .notifications {
        .notification-container {
          display: inline-block;
        }

        .notification-container span {
          line-height: 0.8rem;
        }

        .indicator {
          margin-top: -8px;
        }
      }

      svg:not(:root).svg-inline--fa {
        margin: 0 auto;
      }

      .media {
        .media-body {
          display: none;
        }

        .media-left {
          padding-right: 0;
          margin: 0 auto;
        }
      }
    }
  }
</style>
