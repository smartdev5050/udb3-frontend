<template>
  <div class="person-data">
    <ul>
      <!-- TODO notifications -->
      <li class="hidden-xs">
        <div class="media">
          <div class="media-left">
            <!-- TODO: Get the user image -->
            <img class="media-object" width="50" height="50" :src="picture" />
          </div>
          <div class="media-body">
            <span class="nick">
              {{ user.nick ? user.nick : user.username }} </span
            ><br />
            <ButtonLogout />
          </div>
        </div>
      </li>
    </ul>
    <!-- <div class="visible-xs profile-pic dropup">
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
    </div> -->
  </div>
</template>

<script>
  import ButtonLogout from './ButtonLogout'
  export default {
    components: {
      ButtonLogout,
    },
    data() {
      return {
        user: this.$cookies.get('user'),
        picture: this.$cookies.get('userPicture'),
      }
    },
  }
</script>

<style lang="scss">
  .person-data {
    position: absolute;
    left: 5px;
    bottom: 5px;
  }
</style>
