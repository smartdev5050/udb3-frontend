<template>
  <div>
    <div class="hero">
      <div class="container">
        <HomeSplash />
        <h1 class="brand">UiTdatabank</h1>
        <p class="lead text-center">
          <span> Organiseer je een activiteit?</span> <br />
          <span class="muted">
            Voeg gratis je activiteiten toe en bereik een groter publiek
          </span>
        </p>
      </div>
    </div>

    <div class="start">
      <div class="container-fluid">
        <p class="text-center">
          <a class="btn btn-lg btn-primary" @click="login">Login</a>
        </p>
      </div>
    </div>
    <div class="more">
      <div class="container">
        <div class="row">
          <div class="col-sm-4">
            <blockquote class="quoted-number">
              <p class="accent">215.000</p>
              <h2>activiteiten per jaar</h2>
            </blockquote>
            <p class="info">
              Een uitstap, sportactiviteit, kaartavond, kermis of cursus? Een
              concert, tentoonstelling of film? UiTdatabank staat open voor de
              meest uiteenlopende vrijetijdsactiviteiten.
            </p>
          </div>
          <div class="col-sm-4">
            <blockquote class="quoted-number">
              <p class="accent">500</p>
              <h2>verschillende kanalen</h2>
            </blockquote>
            <p class="info">
              UiTdatabank levert informatie aan meer dan 500 agenda's, waaronder
              UiTinvlaanderen, websites van steden en gemeenten, thema-agenda's,
              gedrukte bladen en mobiele apps. Ook jouw activiteit kan
              verschijnen op vele agenda's.
            </p>
          </div>
          <div class="col-sm-4">
            <blockquote class="quoted-number">
              <p class="accent">28.000</p>
              <h2>organisatoren</h2>
            </blockquote>
            <p class="info">
              Jaarlijks promoten 28.000 organisatoren hun activiteiten via
              UiTdatabank. In totaal bereiken ze daarmee jaarlijks meer dan 3
              miljoen mensen. Voeg net als andere organisatoren je activiteit
              snel en eenvoudig toe.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <p class="text-center lead mission">
              Zo geef je meer mensen meer goesting in jouw activiteit.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import HomeSplash from '../components/HomeSplash'
  import UitidAuth from '../services/auth'
  export default {
    components: { HomeSplash },
    layout: 'login',
    methods: {
      login: () => {
        const auth = new UitidAuth()
        auth.login()
      },
    },
  }
</script>

<style scoped lang="scss">
  .hero {
    background-color: #f0160f;
  }
  .brand {
    display: none;
  }

  .quoted-number {
    margin: 0 0 30px 0;
    padding: 0;
    border-left: 0px;
    text-align: center;

    .accent {
      margin: 0;
      font-size: 6rem;
      font-weight: 300;
      color: #424448;
      line-height: 1;
    }

    h2 {
      font-weight: 400;
      margin-top: 0;
      color: #424448;
    }
  }
</style>
