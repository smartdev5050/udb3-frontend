<template>
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="col-sm-6">
          <ul class="footer-links">
            <li>
              <a href="mailto:vragen@uitdatabank.be" class="footer-link"
                >Contacteer ons</a
              >
            </li>
            <li>
              <a
                href="http://www.publiq.be/nl/project/uitdatabank"
                class="footer-link"
                >Over UiTdatabank</a
              >
            </li>
            <li>
              <a href="http://documentatie.uitdatabank.be" class="footer-link"
                >Voor ontwikkelaars</a
              >
            </li>
            <li>
              <!-- TODO link to conditions in correct language -->
              <a href="http://www.publiq.be/nl" class="footer-link"
                >Gebruiksvoorwaarden</a
              >
              |
              <a href="http://www.publiq.be/nl/" class="footer-link">Privacy</a>
            </li>
          </ul>
        </div>

        <div class="col-sm-6">
          <p class="footer-by">
            <span>Een product van</span>
            <a href="http://www.publiq.be" class="footer-link">publiq vzw</a>
          </p>

          <img
            v-show="$i18n.locale === 'nl'"
            src="~/assets/vlaanderen-logo.png"
            class="logo-flanders-full"
          />
          <img
            v-show="$i18n.locale === 'fr'"
            src="~/assets/flanders-logo.png"
            class="logo-flanders-full"
          />
          <p class="language-switcher">
            <!-- TODO language switcher -->
            <a @click="setLocale('nl')">Nederlands</a>
            <a @click="setLocale('fr')">Français</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      setLocale(locale) {
        this.$i18n.locale = locale;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .footer {
    padding: 30px 0;
    background-color: #ccc;
  }
  .footer-links {
    padding-left: 0;
    list-style: none;
    margin: 0;
  }

  .footer-link {
    color: #555;
    text-decoration: underline;
  }

  .footer-by {
    text-align: right;
  }

  .logo-flanders-full {
    float: right;
    width: 150px;
    margin-bottom: 15px;
  }

  .logo-flanders {
    display: inline-block;
    float: right;

    &::after {
      background-size: 15px 15px;
      background: transparent url('/images/footer/vlaamse_overheid.png')
        no-repeat;
      content: '';
      display: inline-block;
      height: 20px;
      margin-left: 6px;
      margin-top: -10px;
      width: 13px;
      white-space: nowrap;
      vertical-align: bottom;
    }
  }

  .language-switcher {
    text-align: right;
    clear: both;
    margin-top: 12px;

    a {
      color: #004f94;
      cursor: pointer;
      text-decoration: none;
    }
  }
</style>
