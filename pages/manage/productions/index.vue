<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('menu.productions') }}
        <small>
          <nuxt-link to="productions/create">
            {{ $t('actions.create') }}
          </nuxt-link>
        </small>
      </h1>
      <b-table striped hover :items="items" :fields="fields"></b-table>
      <pagination />
    </div>
  </div>
</template>

<script>
  import Pagination from '../../../components/pagination';

  export default {
    components: {
      Pagination,
    },
    data() {
      return {
        fields: ['naam', 'opties'],
        items: [
          { naam: 'Dickerson', opties: 'Macdonald' },
          { naam: 'Larsen', opties: 'Shaw' },
          { naam: 'Geneva', opties: 'Wilson' },
          { naam: 'Jami', opties: 'Carney' },
        ],
      };
    },
    created() {
      // get productions
      this.getAllProductions().then((res) => {
        console.log(res);
      });
      // get events inside each production
      this.getEventById('02d359c4-46fb-4812-9cb1-f6b85e9faa67').then((res) => {
        console.log(res);
      });
    },
    methods: {
      async getAllProductions() {
        return await this.$api.productions.find();
      },
      async getEventById(id) {
        return await this.$api.events.findById(id);
      },
    },
  };
</script>

<style lang="scss">
  small a {
    color: #004f94;
  }
</style>
