<template>
  <div class="wrapper">
    <section class="container-fluid">
      <h1 class="title create-title">
        {{ $t('productions.create') }}
      </h1>

      <p>
        <strong>{{ $t('productions.suggested_events') }}</strong>
        {{ similarityScore }}%
      </p>

      <section class="events-container">
        <event
          v-for="event in suggestedEvents"
          :id="parseEventId(event['@id'])"
          :key="event['@id']"
          :type="getEventType(event.terms)"
          :title="event.name[locale]"
          :image-url="event.image"
          :description="event.description ? event.description[locale] : ''"
        />
      </section>

      <section class="production-name-container">
        <label for="production-name">{{
          $t('productions.production_name')
        }}</label>
        <b-input
          id="production-name"
          v-model="existingProductionName"
          @input="handleInputProductionName"
          @focus="handleFocusProductionName"
          @blur="handleBlurProductionName"
        />
        <section
          v-show="canShowAutoComplete"
          class="container-table-production-name"
        >
          <table class="table table-hover">
            <tbody v-if="!isLoadingProductions">
              <tr
                v-for="production in productions"
                :key="production.production_id"
              >
                <td
                  @click="
                    handleClickProductionName(
                      production.name,
                      production.production_id,
                    )
                  "
                >
                  {{ production.name }}
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
          ><loading-spinner v-if="isLinking" />
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
      similarityScore: 0,
      suggestedEvents: [],
      isLoadingProductions: false,
      canShowAutoComplete: false,
      existingProductionName: '',
      existingProductionId: '',
      productions: [],
      errorMessages: [],
      isLinking: false,
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
    },
    async created() {
      await this.refreshSuggestedEvents();
    },
    methods: {
      async getProductionsByName(options) {
        this.isLoadingProductions = true;
        const { member: productions } = await this.$api.productions.find(
          options,
        );

        this.productions = productions;
        this.isLoadingProductions = false;
      },
      async refreshSuggestedEvents() {
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
        this.isLinking = true;
        if (this.existingProductionId) {
          const reponses = await this.$api.productions.addEventsByIds({
            productionId: this.existingProductionId,
            eventIds: this.suggestedEventIds,
          });
          const errors = reponses.filter((response) => response.status);
          if (errors.length > 0) {
            this.errorMessages = errors.map((error) => error.title);
          }
        } else {
          await this.$api.productions.createWithEvents({
            name: this.existingProductionName,
            eventIds: this.suggestedEventIds,
          });
        }
        this.isLinking = false;
        this.clearExistingProduction();
        this.refreshSuggestedEvents();
      },
      async handleClickSkip() {
        await this.$api.productions.skipSuggestedEvents(this.suggestedEventIds);
        this.clearExistingProduction();
        this.refreshSuggestedEvents();
      },
      async handleInputProductionName() {
        this.canShowAutoComplete = true;
        const getProductionsByName = this.getProductionsByName({
          name: this.existingProductionName,
        });
        await debounce(() => getProductionsByName, 1000);
      },
      handleClickProductionName(name, id) {
        this.existingProductionName = name;
        this.existingProductionId = id;
        this.canShowAutoComplete = false;
      },
      handleFocusProductionName() {
        if (this.existingProductionName) {
          this.canShowAutoComplete = true;
        }
      },
      handleBlurProductionName() {
        if (!this.existingProductionName) {
          this.canShowAutoComplete = false;
        }
      },
      handleDismissed(index) {
        this.errorMessages = this.errorMessages.splice(index, 1);
      },
      clearExistingProduction() {
        this.existingProductionId = '';
        this.existingProductionName = '';
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
