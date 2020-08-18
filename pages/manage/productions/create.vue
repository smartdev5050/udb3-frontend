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

      <section class="event-container"></section>

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
  export default {
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
