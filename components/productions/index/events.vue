<template>
  <table class="table table-events">
    <thead>
      <tr>
        <th scope="col" class="test">
          <span class="events-in-production-label">
            {{
              `${$t('productions.events')} ${$t(
                'productions.in',
              )} '${selectedProductionName}'`
            }}
          </span>
          <a class="add-event-link" @click="handleClickAddEvent">
            {{ !isAddEventVisible ? $t('productions.create') : '' }}
          </a>
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
              <fa v-if="!isAdding" icon="check" />
              <loading-spinner v-else class="button-spinner" />
            </b-button>
            <b-button
              variant="danger"
              @click="handleClickCancelAddEventToProduction"
            >
              <fa icon="times" />
            </b-button>
          </div>
        </th>
      </tr>
    </thead>
    <tbody v-if="isTableVisible">
      <event
        v-for="event in events"
        :id="parseEventId(event['@id'])"
        :key="parseEventId(event['@id'])"
        :name="event.name[locale] || event.name['nl']"
        :type="getEventType(event.terms)"
        :location="event.location.name[locale] || event.location.name['nl']"
        @clickDelete="handleClickDeleteEvent"
      />
    </tbody>
    <tbody v-else-if="isLoading">
      <tr>
        <loading-spinner />
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="text-center">{{ $t('productions.no_events') }}</td>
      </tr>
    </tbody>
  </table>
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
  .table-events {
    width: 60% !important;

    > tbody {
      display: block;
      overflow-x: hidden;
      border-left: 5px solid lighten($color: $udb-primary-color, $amount: 50%);
    }

    th.test {
      display: inline-block;
      align-items: center;
    }

    .add-event-container {
      display: flex;
      margin-top: 1rem;

      .form-control {
        max-width: 21.5rem;
        margin-right: 0.5rem;
      }
    }

    .add-event-link {
      color: $udb-blue;

      &:hover {
        text-decoration: underline;
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
