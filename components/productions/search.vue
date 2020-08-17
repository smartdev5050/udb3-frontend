<template>
  <div class="search-container">
    <b-form-group
      id="fieldset-horizontal"
      label-cols-sm="4"
      label-cols-lg="2"
      label-size="lg"
      label="Zoeken op productienaam:"
      label-for="search-input"
    >
      <b-form-input id="search-input"></b-form-input>
    </b-form-group>
    <b-alert show variant="info"
      >Schrijf een zoekopdracht van minstens 4 karakters in het veld hierboven
      om producties te zoeken. Laat het veld leeg om alle producties op te
      vragen in alfabetische volgorde.</b-alert
    >
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  .search-container {
    .form-row {
      align-items: center;
    }
  }
</style>
