<template>
  <div>
    <div class="sidebar">
      <nuxt-link class="udb-logo-link" to="/dashboard">
        <img src="../assets/udb-logo.svg" alt="Uitdatabank" class="udb-logo" />
        <img
          src="../assets/udb-logo-mobile.svg"
          alt="Uitdatabank"
          class="udb-logo-mobile"
        />
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
            <nuxt-link to="/manage/moderation/overview" class="moderation-link">
              <span>
                <fa icon="flag" />
                <span>{{ $t('menu.validate') }}</span>
              </span>
              <span>
                <span v-if="moderationCount > 0" class="badge">{{
                  moderationCount
                }}</span>
              </span>
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
          <li v-if="isProductionsVisible">
            <nuxt-link to="/manage/productions">
              <fa icon="layer-group" />
              <span>{{ $t('menu.productions') }}</span>
            </nuxt-link>
          </li>
        </ul>
      </div>

      <div class="person-data">
        <ul>
          <li>
            <a>
              <giftbox>
                <template v-slot:icon-and-text>
                  <div>
                    <fa icon="gift" class="giftbox-icon" />
                    <span>{{ $t('giftbox.announcements') }}</span>
                  </div>
                </template>
                <template v-slot:indicator="props">
                  <span class="badge">{{ props.numberOfUnseenFeatures }}</span>
                </template>
              </giftbox>
            </a>
          </li>
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
  import Giftbox from './giftbox';

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
      Giftbox,
    },
    data() {
      return {
        isJobLoggerOpen: false,
        jobLoggerState: JobLoggerStates.IDLE,
        permissions: [],
        roles: [],
        moderationCount: 0,
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
      isProductionsVisible() {
        return this.permissions.includes(Permissions.PRODUCTIES_AANMAKEN);
      },
      showExtraMenuItems() {
        return [
          this.isValidateVisible,
          this.isUsersVisible,
          this.isRolesVisible,
          this.isLabelsVisible,
          this.isOrganisationsVisible,
          this.isProductionsVisible,
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

      const validationQuery = this.roles
        .map((role) =>
          role.constraints !== undefined && role.constraints.v3
            ? role.constraints.v3
            : null,
        )
        .filter((constraint) => constraint !== null)
        .join(' OR ');

      const eventsToModerate = await this.$api.events.findToModerate(
        `(${validationQuery})`,
      );

      this.moderationCount = eventsToModerate.totalItems;
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

<style scoped lang="scss">
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
    padding: 5px;

    .udb-logo-link {
      display: block;
    }
    .udb-logo {
      display: block;
      width: 220px;
      height: 40px;
      margin-bottom: 10px;
    }
    .udb-logo-mobile {
      display: none;
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
      align-items: center;
      text-decoration: none;
      padding: $padding-normal;
      width: 100%;
      font-weight: 400;
    }

    svg:not(:root).svg-inline--fa {
      overflow: visible;
      width: 1rem;
      height: 1rem;
    }

    a .svg-inline--fa {
      margin-right: 6px;
    }

    a:hover:not(.udb-logo-link) {
      background-color: #900d09;
      color: $white;
      text-decoration: none;
      cursor: pointer;
    }

    a.moderation-link {
      display: inline-flex;
      justify-content: space-between;
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

    a.giftbox-container {
      display: inline-flex;
      justify-content: space-between;
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
      padding: 2px 0;

      a:not(.udb-logo-link) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 0.6rem;
        padding: $padding-small;
        width: 100%;
        text-align: center;
        padding-top: $padding-small * 3;
      }

      a div {
        max-width: 100%;
      }

      a span {
        margin-left: 0;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .udb-logo-link {
        margin-bottom: 10px;
      }

      .udb-logo {
        display: none;
      }

      .udb-logo-mobile {
        display: block;
        width: 50px;
        height: 50px;
        margin: 0 auto;
      }

      .management-title {
        text-align: center;
      }

      .notifications {
        .notification-container span {
          line-height: 0.8rem;
        }

        #indicator svg {
          margin-top: -50px;
          margin-right: 0;
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
