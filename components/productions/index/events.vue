<template>
  <section class="list-events" aria-label="List of events in production">
    <template v-if="!isLoading">
      <h2>
        {{
          `${$t('productions.events')} ${$t(
            'productions.in',
          )} '${selectedProductionName}'`
        }}
      </h2>
      <ul class="list-group">
        <event
          v-for="event in events"
          :id="parseEventId(event['@id'])"
          :key="parseEventId(event['@id'])"
          :name="event.name[locale] || event.name['nl']"
          :type="getEventType(event.terms)"
          :location="event.location.name[locale] || event.location.name['nl']"
          class="list-group-item"
          @clickDelete="handleClickDeleteEvent"
        />
      </ul>
    </template>
    <div v-else>
      <loading-spinner />
    </div>
  </section>
</template>

<script>
  import LoadingSpinner from '../../loading-spinner';
  import Event from './event';
  import { parseId } from '@/functions/events';

  export default {
    components: {
      LoadingSpinner,
      Event,
    },
    props: {
      events: {
        type: Array,
        default: () => [],
      },
      isLoading: {
        type: Boolean,
        default: true,
      },
      selectedProductionName: {
        type: String,
        default: '',
      },
      isAdding: {
        type: Boolean,
        default: false,
      },
      hasAddingError: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      isAddEventVisible: false,
      eventId: '',
    }),

    computed: {
      isTableVisible() {
        return !this.isLoading && this.events.length > 0;
      },
      locale() {
        return this.$i18n.locale;
      },
    },
    watch: {
      isAdding(val) {
        if (!val && !this.hasAddingError) {
          this.eventId = '';
        }
      },
      isAddEventVisible(val) {
        if (val) {
          this.$nextTick(() => this.$refs.eventIdInput.focus());
        }
      },
    },
    methods: {
      handleClickAddEvent() {
        this.isAddEventVisible = !this.isAddEventVisible;
      },
      handleClickAddEventToProduction() {
        if (this.eventId) {
          this.$emit('addEventToProduction', this.eventId);
        }
      },
      handleClickCancelAddEventToProduction() {
        this.eventId = '';
        this.isAddEventVisible = false;
      },
      handleInputEventId() {
        this.$emit('inputEventId');
      },
      handleClickDeleteEvent(eventId) {
        this.$emit('clickDeleteEvent', eventId);
      },
      parseEventId(id) {
        return parseId(id);
      },
      getEventType(terms) {
        const foundTerm =
          terms.find((term) => term.domain === 'eventtype') || {};
        return foundTerm.label ? foundTerm.label : '';
      },
    },
  };
</script>

<style lang="scss">
  .list-events {
    width: 60%;

    .add-event-container {
      display: flex;
      margin-top: 1rem;

      .form-control {
        max-width: 21.5rem;
        margin-right: 0.5rem;
      }
    }

    button:not(:last-child) {
      margin-right: 0.5rem;
    }

    .button-spinner.spinner-container {
      margin: 0 !important;

      .spinner-border {
        color: white !important;
        width: 1rem;
        height: 1rem;
      }
    }

    svg.svg-inline--fa {
      width: 1rem;
      height: 1rem;
    }
  }
</style>
