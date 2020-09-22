<template>
  <pub-title :size="1" class="page-title"><slot /></pub-title>
</template>

<script>
  import PubTitle from '@/publiq-ui/pub-title';

  export default {
    components: {
      PubTitle,
    },
  };
</script>

<style scoped>
  .page-title {
    line-height: 3.74rem;
    color: #222;
    border-bottom: 1px solid #ccc;
    margin-bottom: 2rem;
  }
</style>
