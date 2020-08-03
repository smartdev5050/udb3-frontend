<template>
  <div class="pagination">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      :first-text="First"
      :prev-text="$t('actions.previous')"
      :next-text="$t('actions.next')"
    />
  </div>
</template>

<script>
  export default {
    props: {
      currentPage: { type: Number, default: 1 },
      rows: { type: Number, default: 1 },
      perPage: { type: Number, default: 1 },
    },
  };
</script>
