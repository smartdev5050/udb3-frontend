<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('menu.productions') }}
        <small>
          <nuxt-link to="productions/create">
            {{ $t('actions.add') }}
          </nuxt-link>
        </small>
      </h1>
      <pagination />
    </div>
  </div>
</template>

<script>
  import Pagination from '../../../components/pagination';

  export default {
    components: {
      Pagination,
    },
  };
</script>

<style lang="scss">
  small a {
    color: #004f94;
  }
</style>
