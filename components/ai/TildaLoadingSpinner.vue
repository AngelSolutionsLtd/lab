<template>
  <svg
    class="tilda-loader"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M45 24C45 26.7578 44.4568 29.4885 43.4015 32.0364C42.3461 34.5842 40.7993 36.8992 38.8492 38.8492C36.8992 40.7993 34.5842 42.3461 32.0364 43.4015C29.4885 44.4568 26.7578 45 24 45C21.2422 45 18.5115 44.4568 15.9636 43.4015C13.4158 42.3461 11.1008 40.7993 9.15076 38.8492C7.20073 36.8992 5.65388 34.5842 4.59853 32.0364C3.54318 29.4885 3 26.7578 3 24"
      stroke="url(#paint0_linear_1152_5305)"
      stroke-width="6"
      stroke-linecap="round"
    />
    <path
      class="inner-arc"
      d="M14 24C14 22.6868 14.2587 21.3864 14.7612 20.1732C15.2638 18.9599 16.0003 17.8575 16.9289 16.9289C17.8575 16.0003 18.9599 15.2638 20.1732 14.7612C21.3864 14.2587 22.6868 14 24 14C25.3132 14 26.6136 14.2587 27.8268 14.7612C29.0401 15.2638 30.1425 16.0003 31.0711 16.9289C31.9997 17.8575 32.7362 18.9599 33.2388 20.1732C33.7413 21.3864 34 22.6868 34 24"
      stroke="#BCBCBC"
      stroke-opacity="0.2"
      stroke-width="6"
      stroke-linecap="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1152_5305"
        x1="-34.8092"
        y1="-49.9674"
        x2="61.5832"
        y2="-43.6582"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#40C9FF"/>
        <stop offset="1" stop-color="#E81CFF"/>
      </linearGradient>
    </defs>
  </svg>
</template>

<style scoped>
.tilda-loader {
  width: 70px;
  height: 70px;
  animation: spin 1.5s linear infinite;
}

.inner-arc {
  animation: spin-fast 1.8s linear infinite;
  transform-origin: 24px 24px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-fast {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
