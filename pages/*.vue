<template>
  <pub-wrapper>
    <legacy-app-page :path="generatePath" />
  </pub-wrapper>
</template>

<script>
  import LegacyAppPage from '../components/legacy-app-page';
  import PubWrapper from '@/publiq-ui/pub-wrapper';

  export default {
    components: {
      LegacyAppPage,
      PubWrapper,
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

<style lang="scss"></style>
