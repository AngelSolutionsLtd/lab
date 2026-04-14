<template>
	<div role="presentation" class="skeleton one-whole" :class="{'skeleton--dark-mode': darkMode}" :style="{ 'min-height': minHeight, 'width': width }"></div>
</template>

<script type="text/javascript">
	export default {
		name: 'Skeleton-Widget',
		props: {
			minHeight: {
				type: String,
				required: true,
				default: '50px'
			},
			width: {
				type: String
			},
			darkMode: {
				type: Boolean,
				required: false,
				default: false
			}
		}
	};
</script>
<!-- css should be pulled through - for some reason this class is missing [remove once fixed] -->
<style scoped>
    .skeleton {
        display: block;
        background: rgba(240, 243, 247, 1);
        background-image: linear-gradient(to right, rgba(249, 250, 251, 0), rgba(249, 250, 251, 0.75), rgba(249, 250, 251, 0));
        background-repeat: no-repeat;
        background-size: 70% 100%;
        display: inline-block;
        position: relative;
        opacity: 1;
        animation-duration: 0.3s, 2s;
        animation-fill-mode: forwards;
        animation-iteration-count: 1, infinite;
        animation-name: fadeIn, placeholderShimmer;
        animation-timing-function: ease-in;
        margin-bottom: 1.61111rem;
    }

    .skeleton--dark-mode {
        background-color: #d3d3d3 !important;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }

        100% {
            opacity: inherit;
        }
    }

    @keyframes placeholderShimmer {
        0% {
            background-position: -300% 0;
        }

        100% {
            background-position: 300% 0;
        }
    }
</style>