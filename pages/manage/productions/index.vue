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
      <b-table :items="productions" :fields="fieldsProductions"> </b-table>
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
        fieldsProductions: ['name', 'production_id'],
        productions: [
          {
            name: 'Star Wars',
            production_id: 'a8700c8f-4c57-41e7-ad06-b03802def25b',
            events: [
              '02d359c4-46fb-4812-9cb1-f6b85e9faa67',
              '141be7d2-404b-49d8-a0cc-0e9250de6307',
            ],
          },
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
