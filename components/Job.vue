<template>
  <li class="udb-job repeat-animation">
    <p>
      <a class="udb-hide-job-button" @click="handleHide" v-if="isDone">
        <fa icon="trash-o" />
      </a>
      <ins>
        <span>{{ timeAgo() }}</span>
        <fa icon="circle-o-notch" class="udb-job-busy" v-if="!isDone" />
      </ins>
      <span>{{ description }}</span>
      <a role="button" target="_blank" class="btn btn-default" :href="exportUrl" v-if="isDone">
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
    mounted() {
      // Re-render every 30 secs to update the timeAgo
      this.timer = setInterval(function () {
        console.log('interval reached');
        console.log(this.now);
        // Trigger re-render by updating the state
        this.now = Date.now();
      }, 30000);
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
      }
    },
    computed: {
      isDone() {
        return [JobStates.FAILED, JobStates.FINISHED].includes(this.state);
      },
      logDate() {
        if (this.isDone) return this.finishedAt;
        return this.createdAt;
      },
      description() {
        return this.messages[this.state];
      }
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
