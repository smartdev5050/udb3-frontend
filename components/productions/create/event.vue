<template>
  <b-card class="card-event">
    <section class="header">
      <div>
        <p>{{ type }}</p>
        <h2>{{ title }}</h2>
        <p>{{ period }}</p>
      </div>
      <img v-if="imageUrl" :src="imageUrl" :alt="title" class="image" />
    </section>
    <b-card-text>
      <p>{{ description }}</p>
      <section
        v-if="productionName"
        class="list-group-item list-group-item-dark"
      >
        {{ $t('productions.part_of_production') }}
        <strong>{{ productionName }}</strong>
      </section>
    </b-card-text>
  </b-card>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      imageUrl: {
        type: String,
        default: '',
      },
      productionName: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        period: '',
      };
    },
    computed: {
      locale() {
        return this.$i18n.locale;
      },
    },
    async created() {
      this.period = await this.$api.events.getCalendarSummary({
        id: this.id,
        locale: this.locale,
      });
    },
  };
</script>

<style lang="scss">
  .card-event {
    flex: 1;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    img {
      display: block;
      width: 10rem;
      height: 10rem;
      margin-left: 1rem;
      background-position: center center;
      background-repeat: no-repeat;
      object-fit: cover;
    }
  }
</style>
