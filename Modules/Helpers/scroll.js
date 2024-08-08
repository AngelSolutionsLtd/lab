export default class Scroll {
  
  constructor() {
    this.currentScrollPosition = 0;
    this.hasInjectedStyles = false;
    this.body = document.body;
  }

  injectStyles() {
    const css = `
      html.scroll-disabled { 
        height: 100%; 
        overflow: hidden;
      }
      .scroll-disabled body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: fixed;
      }`;

    const styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    styleTag.appendChild(document.createTextNode(css));
    document.head.appendChild(styleTag);

    this.hasInjectedStyles = true;
  }

  disable() {
    if (!this.hasInjectedStyles) {
      this.injectStyles();
    }

    this.updateScrollPosition();

    document.getElementsByTagName('html')[0].classList.add('scroll-disabled');

    if (this.currentScrollPosition > 0) {
      this.body.style.height = `calc(100% + ${this.currentScrollPosition}px)`;
      this.body.style.top = `${-this.currentScrollPosition}px`;
    }

  }

  enable() {
    document.getElementsByTagName('html')[0].classList.remove('scroll-disabled');

    if (this.currentScrollPosition) {
      window.scrollTo(0, this.currentScrollPosition);
    }
  }

  updateScrollPosition() {
    this.currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  }
}


