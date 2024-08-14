<template>
    <tippy
		arrow
		ref="tippy"
		class="d-inline-block"
		:trigger="tippyOptions?.trigger || 'click'"
		:maxWidth="tippyOptions?.maxWidth || '1000px'"
		:placement="tippyOptions?.placement || 'bottom'"
		:theme="tippyOptions?.theme || 'psp responsive'"
		:interactive="tippyOptions?.interactive || true"
		:zIndex="tippyOptions?.zIndex || '9999'"
		:popperOptions="popperOptions"
		@hide="$emit('hide')"
		@hidden="$emit('hidden')"
	>

		<template #trigger>
			<slot name="triggerTarget"></slot>
		</template>

		<slot name="content"></slot>
	</tippy>


   <!-- <tippy interactive
        :animate-fill="false"
        placement="bottom-end"
        distant="7"
        animation="fade"
        theme="light options-popup-tippy"
        trigger="mouseenter"
        maxWidth="400px"
        class="d-inline-block"
        arrow>
        <template v-slot:trigger>
           <i class="entypo--info-circled d-inline-block cursor--pointer brand--secondary"/>
        </template>

        <div class="options-tooltip has-min-width p-0">
            <a class="options-tooltip__link"  @click.prevent="">
              <span class="entypo--pencil" />
              Edit
            </a>
        </div>
    </tippy> -->
</template>

<script>
import { TippyComponent } from 'vue-tippy';
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";

export default {
  components: {
    tippy: TippyComponent,
    data() {
		return {
			// popperOptions: {
			// 	modifiers: {
			// 		preventOverflow: {
			// 			enabled: true,
			// 		}
			// 	},
			// }
		}
	},
	props: {
		tippyOptions: {
			type: Object,
			default: () => ({})
		}   
	}   
  }
};
</script>
