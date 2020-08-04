<template>
  <div class="wrapper">
    <legacy-app-page :path="generatePath" />
  </div>
</template>

<script>
  import LegacyAppPage from '../components/legacy-app-page';
  export default {
    components: {
      LegacyAppPage,
    },
    computed: {
      generatePath() {
        const queryString = new URLSearchParams({
          ...this.$route.query,
          jwt: this.$cookies.get('token'),
          lang: this.$i18n.locale,
        }).toString();

        const path = this.$router.currentRoute.path
          ? this.$router.currentRoute.path
          : '';

        const parsedQueryString = queryString ? `?${queryString}` : '';

        return `${path}${parsedQueryString}`;
      },
    },
  };
</script>

<style lang="scss">
  .wrapper {
    background-color: #f0f0f0;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: left;
    align-items: flex-start;
    text-align: left;
  }
</style>
