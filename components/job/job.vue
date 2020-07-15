<template>
  <li class="udb-job repeat-animation">
    <p v-if="isDone">
      <button type="button" class="close udb-hide-job-button" @click="handleHide" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </p>
    <p>
      <span class="udb-job-date">
        <span>{{ timeAgo() }}</span>
        <fa v-if="isSuccess" icon="check-circle" class="udb-job-success" />
        <fa v-if="!isDone" icon="circle-notch" class="udb-job-busy fa-spin" />
      </span>
      <span>{{ description }}</span>
    </p>
    <p v-if="isSuccess && exportUrl">
      <a role="button" target="_blank" class="btn btn-outline-secondary" :href="exportUrl">
        Downloaden
      </a>
    </p>
  </li>
</template>

<script>
  import { formatDistance } from 'date-fns';

  export const JobStates = {
    CREATED: 'created',
    FINISHED: 'finished',
    FAILED: 'failed',
    STARTED: 'started',
  };

  export const JobTypes = {
    EXPORT: 'export',
    LABEL_BATCH: 'label_batch',
    LABEL_QUERY: 'label_query',
  };

  export default {
    name: 'Job',
    props: {
      state: {
        type: String,
        default: JobStates.CREATED,
      },
      type: {
        type: String,
        default: '',
      },
      id: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: () => new Date(),
      },
      finishedAt: {
        type: Date,
        default: undefined,
      },
      messages: {
        type: Object,
        default: () => ({
          [JobStates.CREATED]: '',
          [JobStates.STARTED]: '',
          [JobStates.FINISHED]: '',
          [JobStates.FAILED]: '',
        })
      },
      exportUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        timer: '',
        now: Date.now()
      };
    },
    computed: {
      isSuccess() {
        return [JobStates.FINISHED].includes(this.state);
      },
      isDone() {
        return [JobStates.FAILED, JobStates.FINISHED].includes(this.state);
      },
      logDate() {
        if (this.isDone) return this.finishedAt;
        return this.createdAt;
      },
      description() {
        return this.messages[this.state];
      },
    },
    mounted() {
      // Re-render every 30 secs to update the timeAgo
      this.timer = setInterval(
        function () {
          // Trigger re-render by updating the state
          this.now = Date.now();
        }.bind(this),
        30000,
      );
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      handleHide() {
        this.$emit('hide', this.id);
      },
      timeAgo() {
        return formatDistance(this.logDate, this.now) + ' ago';
      },
    },
  };
</script>

<style lang="scss">
  .udb-job {
    margin: 0;
    padding: 0 30px 0 0;
    position: relative;
  }
  .udb-job-success {
    color: #5cb85c;
  }
  .udb-job-busy {
    color: #5bc0de;
  }
  .udb-job-busy {
    color: #5bc0de;
  }
  .udb-job-description {
    display: block;
  }
  .udb-hide-job-button {
    position: absolute;
    right: 0;
  }
  .udb-hide-job-button:hover {
    cursor: pointer;
  }
</style>
