<template>
	<div :class="parentClass">
		<div class="user-message islet media d-flex" v-bind:class="[type, background]" v-if="!isHidden">
			<p class="media__color media__icon gamma media__img" v-if="hasIcon">
				<em v-bind:class="icon"></em>
			</p>
			<slot class="media__body"></slot>
			
			<a v-if="closable" class="media__color media__icon gamma media__img--rev ml-auto" @click.prevent="closeCallback">
				<span class="entypo--cancel-circled"></span>
			</a>
		</div>
	</div>
</template>

<script>
    export default {
        name: 'UserMessage',
		data() {
			return {
				isHidden: false
			}
		},
        props: {
            type: {
				type: String,
				default: 'information',
				required: false
			},
			parentClass: {
				type: String
			},
			closable: {
				type: Boolean,
				default: false
			},
			background: {
				type: String,
				required: false
			},
			hasIcon: {
				type: Boolean,
				default: true
			}
        },
		computed: {
			isPositive: function () {
				return this.type.toLowerCase() === 'positive';
			},
			isInformation: function () {
				return this.type.toLowerCase() === 'information';
			},
			isWarning: function () {
				return this.type.toLowerCase() === 'warning';
			},
			isError: function () {
				return this.type.toLowerCase() === 'negative';
			},
			isWhisper: function () {
				return this.type.toLowerCase() === 'whisper';
			},
			isNoData: function () {
				return this.type.toLowerCase() === 'no-data';
			},
			icon: function () {
				if (this.isPositive) return 'entypo--check';
				if (this.isInformation) return 'entypo--info-circled';
				if (this.isWarning) return 'entypo--attention';
				if (this.isError) return 'entypo--attention';
				if (this.isWhisper) return 'entypo--attention';
				if (this.isNoData) return 'entypo--block';
				return '';
			},
			textColor: function () {
				if (this.isPositive) return 'positive-text-color';
				if (this.isInformation) return 'info-text-color';
				if (this.isWarning) return 'warning-text-color';
				if (this.isError) return 'negative-text-color';
			}
    	},
		methods: {
			closeCallback() {
				this.isHidden = true;
			},
		},
    };
</script>