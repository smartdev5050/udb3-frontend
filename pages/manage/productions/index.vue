<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('menu.productions') }}
        <small>
          <a href="manage/productions/create">{{ $t('actions.add') }}</a>
        </small>
      </h1>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  small {
    font-size: 65%;

    a {
      color: #004f94;
    }
  }
</style>
