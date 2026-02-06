<template>
  <div>
    <div class="page-wrapper master--organisation">
      <header class="page-header page-header--sticky">
        <div class="admin-menu-holder">
          <div class="page-width position--relative">
            <ul class="admin-menu">
              <li><a id="ctl00_headerLinks1_lnkHelpDesk" title="Help" class="admin-menu__link admin-menu__link--help"
                  href="#"><span class="entypo--help"></span></a></li>
              <li><a id="ctl00_headerLinks1_myAccount" title="My Account" class="admin-menu__link" href="#"><span
                    class="entypo--user"></span></a></li>
              <li><a id="ctl00_headerLinks1_lnkLogout" title="Log out" class="admin-menu__link admin-menu__link--logout"
                  href="#"><span class="entypo--logout"></span></a></li>
            </ul>
          </div>
        </div>
        <div
          class="secondary visuallyhidden--desk-wide gamma mobile-nav mobile-nav--sticky js-mobile-nav soft-half--left">
          <div class="mobile-nav__wrapper">
            <a href="Home.aspx" class="mobile-nav__home">
              <img src="https://perspective.angelsolutions.co.uk/Perspective/Images/Logos/psp-logo-outline.svg"
                alt="home">
              <span class="mobile-nav__home-link">Home</span>
            </a>
            <a class="js-nav-toggle mobile-nav__menu" aria-label="Menu">
              <span class="entypo--menu push-quarter--right"></span>
              <span class="mobile-nav__home-link">Menu</span>
            </a>
          </div>
        </div>
      </header>
      <div class="js-originalNavHolder">
        <div class="page-nav js-originalNav">
          <div class="page-nav__header">
            <h2>Navigation</h2>
  
            <button class="page-nav__close js-close-flyout">
              <span class="entypo--cancel"></span>
            </button>
          </div>
  
          <div class="page-width">
            <div>
              <ul class="nav">
                <li><a href="/Perspective/Organisation/Home.aspx"><span class="page-nav__logo entypo--large"></span> </a>
                </li>
                <li><a href="/Perspective/Organisation/Schools/Home.aspx">Schools </a> </li>
                <li><a href="/Perspective/Organisation/Analysis.aspx">Analysis </a> </li>
                <li><a href="#nogo">Activities <!--[if gte IE 7]><!--></a><!--<![endif]-->
                  <ul class="page-nav__first-children nav">
                    <li><a href="/Perspective/Organisation/Activities/visits.aspx">Visits </a> </li>
                    <li><a href="/Perspective/Organisation/Activities/visits.aspx#/search">Visits Keyword
                        Search </a> </li>
                    <li><a href="/Perspective/Organisation/Activities/visits.aspx#/actions">Actions </a>
                    </li>
                  </ul>
                </li>
                <li><a href="/Perspective/Organisation/Admin/Alerts.aspx">Alerts </a> </li>
                <li><a href="#nogo">Maps <!--[if gte IE 7]><!--></a><!--<![endif]-->
                  <ul class="page-nav__first-children nav">
                    <li><a href="/Perspective/Organisation/SettingsMap.aspx#/organisation">My Organisation
                      </a> </li>
                    <li><a href="/Perspective/Organisation/SettingsMap.aspx#/matchmaker">MATchmaker </a>
                    </li>
                  </ul>
                </li>
                <li><a href="/Perspective/Organisation/News/ManageNews.aspx">News </a> </li>
                <li><a href="/Perspective/Organisation/Ofsted/Home.aspx">Watchsted </a> </li>
                <li><a href="/Perspective/Organisation/About.aspx">About </a> </li>
                <li><a href="/Perspective/Organisation/Admin/Admin.aspx#/"><span class="entypo--cog"></span>
                  </a> </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
    <div id="mainContent" class="page-content group" :style="fullWidth ? 'padding-bottom: 45px' : ''">
      <div :class="fullWidth ? null : 'page-width'">
        <slot />
      </div>
    </div>
  
    </div>
  
    <footer class="page-footer">
      <div class="page-width">
        <div class="grid">
          <div class="grid__item three-quarters below-desk-one-whole">
            <p class="flush--ends">
              <a class="page-footer__link" href="http://twitter.com/perspectiveedu" target="_blank"
                title="Follow on Twitter">
                <span class="entypo--twitter"></span>
              </a>
              Perspective v.18.5| <a href="TermsAndConditions.aspx">Terms &amp; Conditions</a>
              | Copyright © Angel Solutions Ltd 2005-2026
            </p>
          </div><!--
          -->
          <div class="grid__item one-quarter below-desk-one-whole">
            <p class="flush text--right">
              Site by:
              <a class="push-half--left" href="http://www.angelsolutions.co.uk" target="_blank">
                <span class="underline">Angel Solutions Ltd </span>
              </a>
              <a class="push-half--left" href="http://www.angelsolutions.co.uk" target="_blank">
                <img src="https://perspective.angelsolutions.co.uk/Perspective/Images/Logos/angel-logo.svg" alt="Angel Solutions Ltd" class="page-footer__img svg">
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>

</template>

<script>
  export default {
  name: 'AppShell',
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    }
  }
}
</script>