<template>
  <li class="udb-job repeat-animation">
    <p>
      <ins>
        <span></span>
      </ins>
      <span></span>
    </p>
  </li>
</template>

<script>
  export const JobStates = {
    CREATED: 'created',
    FINISHED: 'finished',
    FAILED: 'failed',
    STARTED: 'started',
  };

  export default {
    name: 'Job',
    props: {
      state: {
        type: String,
        default: JobStates.CREATED,
      },
      id: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
      finishedAt: {
        type: Date,
        default: undefined,
      },
    },
    computed: {
      isDone() {
        return [JobStates.FAILED, JobStates.FAILED].includes(this.state);
      },
      logDate() {
        if (this.isDone()) return this.finishedAt;
        return this.createdAt;
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
