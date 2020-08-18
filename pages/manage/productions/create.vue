<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('productions.create') }}
      </h1>

      <label>{{ $t('productions.suggested_events') }}</label>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  .title {
    text-transform: capitalize;
  }
</style>
