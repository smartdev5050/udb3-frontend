<template>
  <pub-page>
    <legacy-app-page :path="generatePath" />
  </pub-page>
</template>

<script>
  import LegacyAppPage from '../components/legacy-app-page';
  import PubPage from '@/publiq-ui/pub-page';

  export default {
    components: {
      LegacyAppPage,
      PubPage,
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
