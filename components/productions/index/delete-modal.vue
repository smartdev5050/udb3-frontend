<template>
  <pub-modal-question
    :visible="isVisible"
    :confirm-title="$t('productions.overview.delete')"
    :cancel-title="$t('productions.overview.cancel')"
    @hide="handleHide"
  >
    <div class="content-container">
      {{
        eventCount > 1
          ? $t('productions.overview.delete_question_events', {
              eventCount,
              productionName,
            })
          : $t('productions.overview.delete_question_event', { productionName })
      }}
    </div>
  </pub-modal-question>
</template>

<script>
  import PubModalQuestion from '@/publiq-ui/pub-modal-question.vue';

  export default {
    components: {
      PubModalQuestion,
    },
    props: {
      eventCount: {
        type: Number,
        default: 0,
      },
      productionName: {
        type: String,
        default: '',
      },
      isVisible: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      handleHide() {
        this.$emit('hide');
      },
    },
  };
</script>

<style lang="scss">
  .modal-content button {
    text-transform: capitalize;
  }

  .content-container {
    padding: 1rem;
  }
</style>
