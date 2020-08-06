<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('menu.productions') }}
        <small>
          <nuxt-link to="productions/create">
            {{ $t('actions.create') }}
          </nuxt-link>
        </small>
      </h1>
      <productions-table />
    </div>
  </div>
</template>

<script>
  import ProductionsTable from '../../../components/productions-table';

  export default {
    components: {
      ProductionsTable,
    },
  };
</script>

<style lang="scss">
  small a {
    color: #004f94;
  }
</style>
