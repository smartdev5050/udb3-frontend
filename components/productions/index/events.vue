<template>
  <section>
    <template v-if="!isLoading">
      <div class="heading-container">
        <pub-title class="events-title">
          {{
            `${$t('productions.overview.events_in_production', {
              productionName: selectedProductionName,
            })}`
          }}
        </pub-title>
        <div v-if="!isAddEventVisible">
          <pub-button variant="primary" @click="handleClickAddEvent">
            <fa icon="plus" />
            {{ $t('productions.overview.create') }}
          </pub-button>
          <pub-button
            variant="danger"
            :disabled="!canEnableDeleteButton"
            @click="handleClickDelete"
          >
            <fa icon="trash" />
            {{ $t('productions.overview.delete') }}
          </pub-button>
        </div>
      </div>
      <div v-if="isAddEventVisible" class="add-event-container">
        <input
          ref="eventIdInput"
          v-model="eventId"
          type="text"
          :class="{
            'is-invalid': hasErrorMessages && !(eventId === ''),
            'form-control': true,
          }"
          placeholder="cdbid"
          @input="handleInputEventId"
        />
        <pub-button
          variant="primary"
          :disabled="!eventId"
          :loading="isAdding"
          @click="handleClickAddEventToProduction"
        >
          <span>
            <fa icon="check" />
            {{ $t('productions.overview.confirm') }}
          </span>
        </pub-button>
        <pub-button
          variant="secondary"
          @click="handleClickCancelAddEventToProduction"
        >
          <fa icon="times" />
          {{ $t('productions.overview.cancel') }}
        </pub-button>
      </div>
      <pub-alert
        v-for="(errorMessage, index) in errorMessages"
        :key="index"
        variant="warning"
        :visible="errorMessages.length > 0"
        dismissible
        >{{ errorMessage }}
      </pub-alert>
      <pub-panel>
        <pub-list :aria-label="$t('productions.overview.aria.events')">
          <event
            v-for="event in events"
            :id="parseEventId(event['@id'])"
            :key="parseEventId(event['@id'])"
            :name="event.name[locale] || event.name['nl']"
            :type="getEventType(event.terms)"
            :location="event.location.name[locale] || event.location.name['nl']"
            :is-selected="isEventSelected(parseEventId(event['@id']))"
            :is-disabled="isAddEventVisible"
            class="list-group-item"
            @select="handleSelectEvent"
          />
        </pub-list>
      </pub-panel>
    </template>
    <div v-else>
      <pub-spinner />
    </div>
  </section>
</template>

<script>
  import PubSpinner from '@/publiq-ui/pub-spinner';
  import Event from './event';
  import { parseId } from '@/functions/events';
  import PubPanel from '@/publiq-ui/pub-panel';
  import PubList from '@/publiq-ui/pub-list';
  import PubAlert from '@/publiq-ui/pub-alert';
  import PubButton from '@/publiq-ui/pub-button';
  import PubTitle from '@/publiq-ui/pub-title';

  export default {
    components: {
      PubSpinner,
      Event,
      PubPanel,
      PubList,
      PubAlert,
      PubButton,
      PubTitle,
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
      errorMessages: {
        type: Array,
        default: () => [],
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
      hasErrorMessages() {
        return this.errorMessages.length > 0;
      },
    },
    watch: {
      isAdding(val) {
        if (!val && !this.hasErrorMessages) {
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
        this.$emit('cancelAddEvent');
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

<style scoped lang="scss">
  .list-group-item {
    border-radius: 0;
  }

  .heading-container {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    align-items: center;

    .events-title {
      padding: 0.5rem 0;
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

  svg.svg-inline--fa {
    width: 1rem;
    height: 1rem;
  }
</style>
