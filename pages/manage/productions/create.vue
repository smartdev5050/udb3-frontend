<template>
  <div class="wrapper">
    <section class="container-fluid">
      <h1 class="title create-title">
        {{ $t('productions.create') }}
      </h1>

      <p>
        <strong>{{ $t('productions.suggested_events') }}</strong>
        {{ eventSimilarityScore }}%
      </p>

      <section class="events-container">
        <event
          v-for="suggestedEvent in suggestedEvents"
          :id="parseEventId(suggestedEvent['@id'])"
          :key="suggestedEvent['@id']"
          :type="getEventType(suggestedEvent.terms)"
          :title="suggestedEvent.name[locale]"
          :image-url="suggestedEvent.image"
          :description="
            suggestedEvent.description ? suggestedEvent.description[locale] : ''
          "
        />
      </section>

      <section class="production-name-container">
        <label for="production-name">{{
          $t('productions.production_name')
        }}</label>
        <b-input
          id="production-name"
          v-model="productionName"
          @input="handleInputProductionName"
          @focus="handleFocusProductionName"
          @blur="handleBlurProductionName"
        />
        <section
          v-show="showSuggestedProductions"
          class="container-table-production-name"
        >
          <table class="table table-hover">
            <tbody v-if="!isLoadingSuggestedProductions">
              <tr
                v-for="suggestedProduction in suggestedProductions"
                :key="suggestedProduction.production_id"
              >
                <td
                  @click="
                    handleClickProductionName(suggestedProduction.production_id)
                  "
                >
                  {{ suggestedProduction.name }}
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td>
                  <loading-spinner />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>

      <section class="button-container">
        <b-button
          class="button-spinner"
          variant="success"
          @click="handleClickLink"
          ><loading-spinner v-if="isLinkingEventsWithProduction" />
          <span v-else>{{ $t('productions.link') }}</span>
        </b-button>
        <b-button variant="danger" @click="handleClickSkip">{{
          $t('productions.skip')
        }}</b-button>
      </section>
      <b-alert
        v-for="(errorMessage, index) in errorMessages"
        :key="index"
        variant="danger"
        :show="errorMessages.length > 0"
        dismissible
      >
        {{ errorMessage }}
      </b-alert>
    </section>
  </div>
</template>

<script>
  import { debounce } from 'lodash-es';
  import Event from '@/components/productions/create/event';
  import LoadingSpinner from '@/components/loading-spinner';
  import { parseId } from '@/functions/events';

  export default {
    components: {
      Event,
      LoadingSpinner,
    },
    data: () => ({
      eventSimilarityScore: 0,

      suggestedEvents: [],

      isLoadingSuggestedProductions: false,
      showSuggestedProductions: false,
      suggestedProductions: [],
      selectedSuggestedProductionId: '',

      productionName: '',

      errorMessages: [],

      isLinkingEventsWithProduction: false,
    }),
    computed: {
      locale() {
        return this.$i18n.locale;
      },
      suggestedEventIds() {
        return this.suggestedEvents.map((suggestedEvent) =>
          this.parseEventId(suggestedEvent['@id']),
        );
      },
      selectedSuggestedProductionName() {
        return this.suggestedProductions.find(
          (suggestedProduction) =>
            suggestedProduction.id === this.selectedSuggestedProductionId,
        );
      },
    },
    async created() {
      await this.getSuggestedEvents();
    },
    methods: {
      async getSuggestedProductionsByName(options) {
        this.isLoadingSuggestedProductions = true;

        const {
          member: suggestedProductions,
        } = await this.$api.productions.find(options);

        this.suggestedProductions = suggestedProductions;

        this.isLoadingSuggestedProductions = false;
      },
      async getSuggestedEvents() {
        this.suggestedEvents = await this.$api.productions.getSuggestedEvents();
      },
      getEventType(terms) {
        const foundTerm =
          terms.find((term) => term.domain === 'eventtype') || {};
        return foundTerm.label ? foundTerm.label : '';
      },
      parseEventId(id) {
        return parseId(id);
      },
      async handleClickLink() {
        this.isLinkingEventsWithProduction = true;

        if (this.selectedSuggestedProductionId) {
          const reponses = await this.$api.productions.addEventsByIds({
            productionId: this.selectedSuggestedProductionId,
            eventIds: this.suggestedEventIds,
          });
          const errors = reponses.filter((response) => response.status);
          if (errors.length > 0) {
            this.errorMessages = errors.map((error) => error.title);
          }
        } else {
          await this.$api.productions.createWithEvents({
            name: this.productionName,
            eventIds: this.suggestedEventIds,
          });
        }

        this.isLinkingEventsWithProduction = false;

        this.clearAndRefreshSuggestedEvents();
      },
      async handleClickSkip() {
        await this.$api.productions.skipSuggestedEvents(this.suggestedEventIds);
        this.clearAndRefreshSuggestedEvents();
      },
      async handleInputProductionName() {
        this.showSuggestedProductions = true;
        const getSuggestedProductionsByName = this.getSuggestedProductionsByName(
          {
            name: this.productionName,
          },
        );
        await debounce(() => getSuggestedProductionsByName, 1000);
      },
      handleClickProductionName(id) {
        this.selectedSuggestedProductionId = id;
        this.productionName = this.selectedSuggestedProductionName;
        this.showSuggestedProductions = false;
      },
      handleFocusProductionName() {
        if (this.productionName) {
          this.showSuggestedProductions = true;
        }
      },
      handleBlurProductionName() {
        if (!this.productionName) {
          this.showSuggestedProductions = false;
        }
      },
      clearAndRefreshSuggestedEvents() {
        this.selectedSuggestedProductionId = '';
        this.productionName = '';
        this.suggestedProductions = [];
        this.getSuggestedEvents();
      },
    },
  };
</script>

<style lang="scss">
  label {
    font-size: 1rem;
    font-weight: 700;
  }

  .events-container {
    display: flex;
    max-width: 84rem;
    margin-bottom: 1rem;
  }

  .production-name-container {
    margin-bottom: 1rem;
  }

  #production-name {
    max-width: 43rem;
  }

  .container-table-production-name {
    max-width: 43rem;
    max-height: 14rem;
    margin-bottom: 0;
    margin-top: 0.5rem;
    overflow-y: scroll;

    table {
      margin-bottom: 0;
    }

    tr {
      background-color: $white;
    }

    .spinner-container {
      margin: 0;
    }
  }

  .button-container {
    display: flex;
    margin-bottom: 1rem;

    button {
      margin-right: 0.5rem;
    }

    .spinner-container {
      margin: 0;

      .spinner-border {
        color: $white !important;
        width: 1rem;
        height: 1rem;
      }
    }
  }
</style>
