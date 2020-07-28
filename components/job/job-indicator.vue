<template>
  <div class="indicator">
    <fa v-show="isWarning" icon="exclamation-circle" class="bounce" />
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

    .bounce {
      -webkit-animation: bounce 2s infinite linear;
      animation: bounce 2s infinite linear;
    }

    @keyframes bounce {
      0%,
      25%,
      50%,
      75%,
      100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-12px);
      }
    }
  }
</style>
