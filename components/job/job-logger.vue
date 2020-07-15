<template>
  <div>
    <div class="udb-job-log" :class="{ open: isOpen }">
      <div class="udb-job-log-header">
        <div class="row">
          <div class="col-sm-12">
            <button type="button" class="close" @click="handleClickClose">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="col-sm-12">
            <div class="udb-job-log-header-message">
              <!-- udb-job-log-header-message -->
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="udb-job-block udb-job-block-ready">
            <p class="udb-job-title">geëxporteerde documenten</p>
            <ul class="list-unstyled udb-job-messages">
              <job
                v-for="job in finishedExportJobs"
                :id="job.id"
                :key="job.id"
                :created-at="job.createdAt"
                :finished-at="job.finishedAt"
                :state="job.state"
                :messages="job.messages"
                :export-url="job.exportUrl"
                @hide="hideJob"
              />
            </ul>
          </div>

          <div class="udb-job-block udb-job-block-errors">
            <p class="udb-job-title">
              meldingen
              <span class="badge"></span>
            </p>
            <ul class="list-unstyled udb-job-messages">
              <job
                v-for="job in failedJobs"
                :id="job.id"
                :key="job.id"
                :created-at="job.createdAt"
                :finished-at="job.finishedAt"
                :state="job.state"
                :messages="job.messages"
                @hide="hideJob"
              />
            </ul>
          </div>

          <div class="udb-job-block udb-job-block-pending">
            <p class="udb-job-title">bezig</p>
            <ul class="list-unstyled udb-job-messages">
              <job
                v-for="job in queuedJobs"
                :id="job.id"
                :key="job.id"
                :created-at="job.createdAt"
                :finished-at="job.finishedAt"
                :state="job.state"
                :messages="job.messages"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="udb-job-log-overlay"></div>
  </div>
</template>

<script>
  import { MessageSources, MessageTypes } from '../../services/messages';
  import Job, { JobStates, JobTypes } from './job';

  export const JobLoggerStates = {
    IDLE: 'idle',
    WARNING: 'warning',
    BUSY: 'busy',
    COMPLETE: 'complete',
  };

  export default {
    name: 'job-logger',
    components: {
      Job,
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        hiddenJobIds: [],
        jobs: [],
      };
    },
    watch: {
      state(state) {
        this.$emit('statechange', state);
      },
    },
    computed: {
      state() {
        if (this.hasFailedJobs) {
          return JobLoggerStates.WARNING;
        }

        if (this.hasCompletedJobs) {
          return JobLoggerStates.COMPLETE;
        }

        if (this.hasActiveJobs) {
          return JobLoggerStates.BUSY;
        }

        return JobLoggerStates.IDLE;
      },
      hasActiveJobs() {
        return this.queuedJobs.length > 0;
      },
      hasCompletedJobs() {
        return this.filterJobsOnState(JobStates.FINISHED).length > 0;
      },
      hasFailedJobs() {
        return this.failedJobs.length > 0;
      },
      newJobs() {
        return this.filterJobsOnState(JobStates.CREATED);
      },
      startedExportJobs() {
        return this.filterJobsOnState(JobStates.STARTED);
      },
      finishedExportJobs() {
        return this.filterJobsOnState(JobStates.FINISHED).filter((job) => {
          return job.type === JobTypes.EXPORT;
        });
      },
      failedJobs() {
        return this.filterJobsOnState(JobStates.FAILED);
      },
      queuedJobs() {
        return this.startedExportJobs.concat(this.newJobs);
      },
    },
    mounted() {
      this.socket = this.$nuxtSocket({});

      this.socket.on('job_started', this.jobStartedHandler);
      this.socket.on('job_info', this.jobInfoHandler);
      this.socket.on('job_finished', this.jobFinishedHandler);
      this.socket.on('job_failed', this.jobFailedHandler);

      window.addEventListener('message', this.handleMessage);
    },
    beforeDestroy() {
      this.socket.close();
      window.removeEventListener('message', this.handleMessage);
    },
    methods: {
      addJob(data) {
        this.jobs.unshift({ state: JobStates.CREATED, exportUrl: '', ...data });
      },
      filterJobsOnState(state) {
        return this.jobs.filter(
          (job) => !this.hiddenJobIds.includes(job.id) && job.state === state,
        );
      },
      findJob(id) {
        return this.jobs.find((job) => job.id === id);
      },
      hideJob(id) {
        if (this.hiddenJobIds.includes(id)) return;
        this.hiddenJobIds.push(id);
      },
      updateJobState(id, state) {
        const job = this.findJob(id);
        if (!job) return;

        if ([JobStates.FAILED, JobStates.FINISHED].includes(job.state)) {
          // Don't update job's that already have a failed or finished state.
          // Due to how socket messages are sent, we might otherwise set a failed state as finished.
          return;
        }

        job.state = state;

        if (
          job.state === JobStates.FINISHED ||
          job.state === JobStates.FAILED
        ) {
          job.finishedAt = new Date();
        }
      },
      handleClickClose() {
        this.$emit('close');
      },
      handleMessage(event) {
        if (event.data.source !== MessageSources.UDB) {
          return;
        }

        if (
          event.data.type === MessageTypes.JOB_ADDED &&
          event.data.job !== undefined
        ) {
          this.addJob(event.data.job);
        }
      },
      /* eslint-disable camelcase */
      jobStartedHandler({ job_id }) {
        console.log('job started: ', job_id);
        this.updateJobState(job_id, JobStates.STARTED);
      },
      jobInfoHandler({ job_id, location }) {
        if (!location) {
          return;
        }

        const job = this.findJob(job_id);
        if (!job) {
          return;
        }

        job.exportUrl = location;
        console.log('job info: ', job_id);
      },
      jobFinishedHandler({ job_id }) {
        console.log('job finished: ', job_id);
        this.updateJobState(job_id, JobStates.FINISHED);
      },
      jobFailedHandler({ job_id }) {
        console.log('job failed: ', job_id);
        this.updateJobState(job_id, JobStates.FAILED);
      },
      /* eslint-enable camelcase */
    },
  };
</script>

<style lang="scss">
  .list-unstyled {
    padding-left: 0;
    list-style: none;
  }
  .udb-job-log {
    width: 320px;
    left: -90px;
    right: 0;
    position: fixed;
    top: 0px;
    bottom: 0;
    transition: left 0.3s ease;
    overflow-x: hidden;
    overflow-y: auto;
    background: #ffffff;
    border-right: silver;
    padding: 10px;
    z-index: 1029;
  }

  /*
  .repeat-animation.ng-enter {
    -webkit-transition: all linear 1s;
    -moz-transition: all linear 1s;
    -o-transition: all linear 1s;
    transition: all linear 1s;
  }
  .repeat-animation.ng-enter {
    opacity: 0;
  }
  .repeat-animation.ng-enter.ng-enter-active {
    opacity: 1;
  }
  */

  .udb-job-log.open {
    left: 230px;
  }
  .udb-hide-job-button {
    position: absolute;
    right: 0;
  }
  .udb-hide-job-button:hover {
    cursor: pointer;
  }
  .udb-job-title {
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 1px solid #000;
  }
  .udb-job-date {
    text-decoration: none;
    color: #777;
    font-size: 0.75em;
    display: block;
  }
  .badge {
    background-color: #d9534f;
  }
  .udb-job-success {
    color: #5cb85c;
  }
  .udb-job-busy {
    color: #5bc0de;
  }

  /* .udb-job-description {
    display: block;
  } */

  /* .udb-job-log-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.5;
    z-index: 2;
    display: block;
  } */

  @media (max-width: 767px) {
    .udb-job-log {
      width: 275px;
      left: -275px;
    }
  }

  .close {
    float: right;
    font-size: 21px;
    font-weight: bold;
    line-height: 1;
    color: #000000;
    text-shadow: 0 1px 0 #ffffff;
    opacity: 0.2;
    filter: alpha(opacity=20);
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
  }
  .close:hover,
  .close:focus {
    color: #000000;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.5;
    filter: alpha(opacity=50);
  }
</style>
