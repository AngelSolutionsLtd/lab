<template>
    <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
            <!-- <a class="no-underline" :href="card.url">
                <div class="landing-card" :class="isHorizontal ? 'landing-card--horizontal' : 'landing-card--light landing-card--shadow text-center'">
                    <div class="landing-card__img" v-html="card.svg"></div>

                    <template v-if="!isHorizontal">
                        <div class="landing-card__img landing-card__img--large" v-html="card.svg"></div>

                        <h2 class="delta landing-card__title mb-3">{{ card.title }}</h2>
                        <p class="landing-card__copy text-center">
                            {{ card.text }}
                        </p>
                    </template>

                    <div class="landing-card__content" v-else>
                        <h2 class="landing-card__title">{{card.title}}</h2>
                        <p class="landing-card__caption">{{card.text}}</p>
                    </div>
                </div>
            </a> -->

            <a class="no-underline" :href="card.url">
                <div :class="cardClass">
                    <div v-if="isHorizontal" class="landing-card__img" v-html="card.svg"></div>
                    <div class="landing-card__img landing-card__img--large" v-if="!isHorizontal" v-html="card.svg"></div>
                    
                    <div class="landing-card__content">
                        <h2 :class="titleClass">{{ card.title }}</h2>
                        <p :class="textClass">{{ card.text }}</p>
                    </div>

                    <div v-if="!isHorizontal" class="d-flex justify-content-center">
                        <div class="landing-card__button">
                            <button class="btn btn--secondary--inverted"><i class="entypo--eye mr-1"></i> KPIs </button>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'LandingCard',
        props: {
            card: {
                type: Object,
                required: true
            },
            isHorizontal: {
                type: Boolean,
                default: false
            },
            hasShadow: {
                type: Boolean,
                default: false
            },
            canAccess: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            cardClass() {
                return {
                    'landing-card': true,
                    'landing-card--horizontal': this.isHorizontal,
                    'landing-card--light': !this.isHorizontal,
                    'landing-card--shadow': this.hasShadow,
                    'text-center': !this.isHorizontal,
                    'landing-card--disabled': !this.canAccess
                };
            },
            titleClass() {
                return this.isHorizontal ? 'landing-card__title' : 'large-title landing-card__title mb-3';
            },
            textClass() {
                return this.isHorizontal ? 'landing-card__caption' : 'landing-card__copy text-center brand--secondary';
            }
        }
    }
</script>

<style lang="scss">
    .landing-card__title {
        &.large-title {
            font-size: 24px;
        }
    }
</style>