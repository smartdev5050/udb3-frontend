<template>
  <div id="indicator">
    <svg
      v-show="isWarning"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="10 30 20 20"
    >
      <g class="warning">
        <circle id="warning-background" cx="20" cy="40" r="10"></circle>
        <circle
          id="warning-circle"
          fill="#ED1C24"
          cx="20"
          cy="40"
          r="8"
        ></circle>
        <g transform="translate(-50,-1.666667)">
          <path
            id="warning-remark"
            fill="#FFFFFF"
            d="M68.798,45.538c0-0.383,0.103-0.672,0.308-0.868s0.504-0.294,0.896-0.294c0.378,0,0.671,0.1,0.878,0.301 c0.208,0.201,0.312,0.488,0.312,0.861c0,0.36-0.104,0.644-0.314,0.851S70.375,46.7,70.001,46.7c-0.383,0-0.679-0.102-0.889-0.304 S68.798,45.907,68.798,45.538z M70.842,43.2h-1.668l-0.349-6.679h2.365L70.842,43.2z"
          ></path>
        </g>
      </g>
    </svg>

    <svg
      v-show="isBusy"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="10 30 20 20"
    >
      <g class="busy" fill-rule="evenodd" fill="none">
        <circle id="busy-background" cx="20" cy="40" r="10"></circle>
        <g stroke-width="2" transform="translate(14 34)" class="busy-spinner">
          <path d="M12 6c0-6-6-6-6-6" transform="rotate(308.674 6 6)">
            <animateTransform
              repeatCount="indefinite"
              dur="1s"
              to="360 6 6"
              from="0 6 6"
              type="rotate"
              attributeName="transform"
            ></animateTransform>
          </path>
        </g>
      </g>
    </svg>

    <svg
      v-show="isComplete"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="10 30 20 20"
    >
      <g class="complete" fill-rule="evenodd" fill="none">
        <circle id="complete-background" cx="20" cy="40" r="10"></circle>
        <circle id="complete-circle" cx="20" cy="40" r="8"></circle>
        <g stroke-width="2" transform="translate(-6 14)" class="complete-check">
          <path
            d="M31.162,24.359l-4.612,4.611l-0.864,0.867c-0.115,0.114-0.274,0.178-0.434,0.178s-0.318-0.063-0.433-0.178
        l-0.866-0.867l-2.307-2.307c-0.115-0.114-0.179-0.272-0.179-0.432c0-0.16,0.063-0.318,0.179-0.433l0.866-0.867
        c0.115-0.115,0.273-0.179,0.434-0.179c0.159,0,0.317,0.063,0.433,0.179l1.873,1.88l4.178-4.186
        c0.115-0.115,0.275-0.179,0.434-0.179c0.159,0,0.318,0.063,0.433,0.179l0.866,0.866c0.116,0.114,0.179,0.273,0.179,0.434
        C31.341,24.086,31.278,24.244,31.162,24.359z"
          ></path>
        </g>
      </g>
    </svg>
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
  #indicator {
    svg {
      display: block;
      margin: 0 auto;
      width: 20px;
      height: 20px;
      overflow: visible;
    }

    @keyframes bounce {
      0%,
      20%,
      50%,
      80%,
      100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      60% {
        transform: translateY(-15px);
      }
    }

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
      }
    }

    .warning {
      animation: bounce 1s infinite linear;
      -webkit-animation: bounce 1s infinite linear;
    }

    .busy-spinner {
      stroke: #3e88ab;
    }

    .complete {
      animation: bounceIn 0.75s 1 linear;
      -webkit-animation: bounceIn 0.75s 1 linear;
    }

    #complete-background,
    #warning-background,
    #busy-background {
      fill: #ffffff;
    }
    #complete-circle {
      fill: #48874a; /* Succes text */
    }
    #warning-circle {
      fill: #d9534f;
    }
    .complete-check {
      fill: #dcf2d7; /* Succces background */
    }
  }
</style>
