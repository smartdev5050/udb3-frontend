<template>
  <div class="indicator">
    <fa v-show="isWarning" icon="exclamation-circle" />
    <fa v-show="isBusy" icon="spinner" class="loading-icon" />
    <fa v-show="isComplete" icon="check" />
  </div>
</template>

<script>
  import { JobLoggerStates } from './job-logger';

  export default {
    name: 'JobIndicator',
    props: {
      state: {
        type: String,
        default: JobLoggerStates.IDLE,
      },
    },
    computed: {
      isBusy() {
        return this.state === JobLoggerStates.BUSY;
      },
      isWarning() {
        return this.state === JobLoggerStates.WARNING;
      },
      isComplete() {
        return this.state === JobLoggerStates.COMPLETE;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .indicator {
    margin-left: 10px;

    .loading-icon {
      -webkit-animation: fa-spin 2s infinite linear;
      animation: fa-spin 2s infinite linear;
    }
  }
</style>
