<template>
  <div class="wrapper">
    <section class="container-fluid">
      <h1 class="title">
        {{ $t('productions.create') }}
      </h1>

      <p>
        <strong>{{ $t('productions.suggested_events') }}</strong>
        {{ similarityScore }}%
      </p>

      <section class="events-container">
        <event
          type="Theatervoorstelling"
          title="Kommil foo: Oogst"
          :date="new Date()"
          img-url="https://jira.uitdatabank.be/secure/attachment/26773/26773_similarity_basic+setup.png"
          description="hjkfdshkfdshjkfsdhjkhjksfdhjkfdshjkdfshj"
        />
        <event
          type="Theatervoorstelling"
          title="Kommil foo: Oogst"
          :date="new Date()"
          img-url="https://jira.uitdatabank.be/secure/attachment/26773/26773_similarity_basic+setup.png"
          description="hjkfdshkfdshjkfsdhjkhjksfdhjkfdshjkdfshj"
        />
      </section>

      <section class="production-name-container">
        <label for="production-name">{{
          $t('productions.production_name')
        }}</label>
        <b-input id="production-name" />
      </section>

      <section class="button-container">
        <b-button variant="success">{{ $t('productions.link') }}</b-button>
        <b-button variant="danger">{{ $t('productions.skip') }}</b-button>
      </section>
    </section>
  </div>
</template>

<script>
  import Event from '@/components/productions/create/event';

  export default {
    components: {
      Event,
    },
    data: () => ({
      similarityScore: 0,
    }),
  };
</script>

<style lang="scss">
  .title {
    text-transform: capitalize;
  }

  label {
    font-size: 1rem;
    font-weight: 700;
  }

  .events-container {
    display: flex;
    max-width: 50rem;
  }

  .card {
    flex: 1;

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  .production-name-container {
    margin-bottom: 1rem;
  }

  .button-container {
    display: flex;

    button {
      margin-right: 0.5rem;
    }
  }
</style>
