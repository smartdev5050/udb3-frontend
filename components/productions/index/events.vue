<template>
  <section class="list-events" aria-label="List of events in production">
    <template v-if="!isLoading">
      <div class="heading-container">
        <h2>
          {{
            `${$t('productions.events')} ${$t(
              'productions.in',
            )} '${selectedProductionName}'`
          }}
        </h2>
        <div v-if="!isAddEventVisible">
          <b-button variant="primary" @click="handleClickAddEvent">
            <fa icon="plus" />
            {{ $t('productions.create') }}
          </b-button>
          <b-button
            variant="danger"
            :disabled="!canEnableDeleteButton"
            @click="handleClickDelete"
          >
            <fa icon="trash" />
            {{ $t('productions.delete') }}
          </b-button>
        </div>
      </div>
      <div v-if="isAddEventVisible" class="add-event-container">
        <input
          ref="eventIdInput"
          v-model="eventId"
          type="text"
          :class="{
            'is-invalid': hasAddingError && !(eventId === ''),
            'form-control': true,
          }"
          placeholder="cdbid"
          @input="handleInputEventId"
        />
        <b-button
          variant="success"
          :disabled="!eventId"
          @click="handleClickAddEventToProduction"
        >
          <span v-if="!isAdding">
            <fa icon="check" />
            {{ $t('productions.confirm') }}
          </span>
          <loading-spinner v-else class="button-spinner" />
        </b-button>
        <b-button
          variant="danger"
          @click="handleClickCancelAddEventToProduction"
        >
          <fa icon="times" />
          {{ $t('productions.cancel') }}
        </b-button>
      </div>
      <ul class="list-group">
        <event
          v-for="event in events"
          :id="parseEventId(event['@id'])"
          :key="parseEventId(event['@id'])"
          :name="event.name[locale] || event.name['nl']"
          :type="getEventType(event.terms)"
          :location="event.location.name[locale] || event.location.name['nl']"
          :is-selected="isEventSelected(parseEventId(event['@id']))"
          class="list-group-item"
          @select="handleSelectEvent"
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
      selectedEventIds: {
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
      canEnableDeleteButton() {
        return this.selectedEventIds.length > 0;
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
      handleSelectEvent(eventId) {
        this.$emit('selectEvent', eventId);
      },
      handleClickDelete() {
        this.$emit('deleteEvents');
      },
      parseEventId(id) {
        return parseId(id);
      },
      getEventType(terms) {
        const foundTerm =
          terms.find((term) => term.domain === 'eventtype') || {};
        return foundTerm.label ? foundTerm.label : '';
      },
      isEventSelected(eventId) {
        return !!this.selectedEventIds.find((id) => id === eventId);
      },
    },
  };
</script>

<style lang="scss">
  .list-events {
    width: 60%;

    .list-group-item {
      border-radius: 0;
    }

    .btn {
      text-transform: capitalize;
    }

    .heading-container {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;

      h2 {
        margin-bottom: 0;
      }
    }

    .add-event-container {
      display: flex;
      margin-bottom: 1rem;

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
