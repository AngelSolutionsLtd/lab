import LandingCard from './LandingCard.vue';

export default {
	title: 'Components/LandingCard',
	component: LandingCard,
	tags: ['autodocs'],
	argTypes: {
		card: {
			control: 'object',
			description: 'Card data including url, svg, title, and text',
		},
		isHorizontal: {
			control: 'boolean',
			description: 'Toggle card horizontal'
		},
		hasShadow: {
			control: 'boolean',
			description: 'Add shadow to the card',
			defaultValue: false,
		  },
		canAccess: {
			control: 'boolean',
			description: 'Toggle access to the card (disables card)',
			defaultValue: true,
		}
	},
};

const Template = (args) => ({
	components: { LandingCard },
	setup() {
		return { args };
	},
	template: `
		<LandingCard :card="args.card" :isHorizontal="args.isHorizontal" :hasShadow="args.hasShadow" :canAccess="args.canAccess" />
	`,
});

export const Default = Template.bind({});
Default.args = {
	card: {
		url: 'https://example.com',
		svg: '<svg width="176" height="126" viewBox="0 0 176 126" fill="none" xmlns="http://www.w3.org/2000/svg"> <g id="Obs Analysis Icons"> <path id="the-blob" fill-rule="evenodd" clip-rule="evenodd" d="M88.3899 119.924C71.6253 122.08 53.8869 128.821 38.9646 123.348C23.7876 117.782 19.0738 103.883 12.7474 92.1807C6.33653 80.3216 -3.50332 67.795 2.22532 55.3862C7.88405 43.129 28.4523 39.4685 41.222 30.5025C55.1639 20.7134 61.5762 2.26445 80.3114 0.559324C98.9651 -1.13853 109.018 15.9967 124.9 22.8864C141.306 30.0026 169.05 27.8764 174.626 41.4718C180.304 55.3172 156.774 66.8998 148.501 80.4276C142.149 90.8136 143.42 103.805 131.867 111.395C120.232 119.04 103.481 117.982 88.3899 119.924Z" fill="#E1E8EE"></path> <g id="screen-icon"> <g clip-path="url(#clip0_814_9110)"> <rect x="21.5" y="21.4417" width="120" height="90" rx="4" fill="white"></rect> <g id="Frame 15834"> <rect width="120" height="12" transform="translate(21.5 21.4417)" fill="#2C3E4F"></rect> </g> <circle id="Ellipse 100" cx="29.5" cy="27.4417" r="2" fill="white" fill-opacity="0.5"></circle> <circle id="Ellipse 101" cx="133.5" cy="27.4417" r="2" fill="white" fill-opacity="0.5"></circle> </g> <rect x="22" y="21.9417" width="119" height="89" rx="3.5" stroke="#EAECED"></rect> </g> <g id="Frame 15841"> <g id="Frame 15839"> <g id="Frame 15836"> <rect id="Rectangle 1709" width="24" height="3" transform="matrix(1 0 0 -1 29.0146 58.4417)" fill="#E3E8EC"></rect> <g id="Frame 15835"> <g id="Rectangle 1709_2"> <mask id="path-8-inside-1_814_9110" fill="white"> <path d="M29.0146 69.4417H49.0146V64.4417H29.0146V69.4417Z"></path> </mask> <path d="M29.0146 69.4417H49.0146V64.4417H29.0146V69.4417Z" fill="#F8E3DF"></path> <path d="M29.0146 68.4417H49.0146V70.4417H29.0146V68.4417Z" fill="#B64638" mask="url(#path-8-inside-1_814_9110)"></path> </g> <g id="Rectangle 1710"> <mask id="path-10-inside-2_814_9110" fill="white"> <path d="M53.0146 69.4417H59.0146V64.4417H53.0146V69.4417Z"></path> </mask> <path d="M53.0146 69.4417H59.0146V64.4417H53.0146V69.4417Z" fill="#FFF8E0"></path> <path d="M53.0146 68.4417H59.0146V70.4417H53.0146V68.4417Z" fill="#FECE25" mask="url(#path-10-inside-2_814_9110)"></path> </g> <g id="Rectangle 1711"> <mask id="path-12-inside-3_814_9110" fill="white"> <path d="M63.0146 69.6989H77.0146V64.4417H63.0146V69.6989Z"></path> </mask> <path d="M63.0146 69.6989H77.0146V64.4417H63.0146V69.6989Z" fill="#E0F5DC"></path> <path d="M63.0146 68.6989H77.0146V70.6989H63.0146V68.6989Z" fill="#559A47" mask="url(#path-12-inside-3_814_9110)"></path> </g> </g> </g> <g id="Frame 15837"> <rect id="Rectangle 1709_3" width="24" height="3" transform="matrix(1 0 0 -1 29.0146 83.2131)" fill="#E3E8EC"></rect> <g id="Frame 15836_2"> <g id="Rectangle 1709_4"> <mask id="path-15-inside-4_814_9110" fill="white"> <path d="M29.0146 94.2131H37.0146V89.2131H29.0146V94.2131Z"></path> </mask> <path d="M29.0146 94.2131H37.0146V89.2131H29.0146V94.2131Z" fill="#F8E3DF"></path> <path d="M29.0146 93.2131H37.0146V95.2131H29.0146V93.2131Z" fill="#B64638" mask="url(#path-15-inside-4_814_9110)"></path> </g> <g id="Rectangle 1710_2"> <mask id="path-17-inside-5_814_9110" fill="white"> <path d="M41.0146 94.4703H63.0146V89.2131H41.0146V94.4703Z"></path> </mask> <path d="M41.0146 94.4703H63.0146V89.2131H41.0146V94.4703Z" fill="#FFF8E0"></path> <path d="M41.0146 93.4703H63.0146V95.4703H41.0146V93.4703Z" fill="#FECE25" mask="url(#path-17-inside-5_814_9110)"></path> </g> <g id="Rectangle 1711_2"> <mask id="path-19-inside-6_814_9110" fill="white"> <path d="M67.0146 94.2131H77.0146V89.2131H67.0146V94.2131Z"></path> </mask> <path d="M67.0146 94.2131H77.0146V89.2131H67.0146V94.2131Z" fill="#E0F5DC"></path> <path d="M67.0146 93.2131H77.0146V95.2131H67.0146V93.2131Z" fill="#559A47" mask="url(#path-19-inside-6_814_9110)"></path> </g> </g> </g> </g> <g id="Frame 15840"> <g id="Frame 15836_3"> <rect id="Rectangle 1709_5" width="24" height="3" transform="matrix(1 0 0 -1 87.5289 58.4417)" fill="#E3E8EC"></rect> <g id="Frame 15836_4"> <g id="Rectangle 1709_6"> <mask id="path-22-inside-7_814_9110" fill="white"> <path d="M87.5289 69.4417H97.5289V64.4417H87.5289V69.4417Z"></path> </mask> <path d="M87.5289 69.4417H97.5289V64.4417H87.5289V69.4417Z" fill="#F8E3DF"></path> <path d="M87.5289 68.4417H97.5289V70.4417H87.5289V68.4417Z" fill="#B64638" mask="url(#path-22-inside-7_814_9110)"></path> </g> <g id="Rectangle 1710_3"> <mask id="path-24-inside-8_814_9110" fill="white"> <path d="M101.529 69.4417H115.529V64.4417H101.529V69.4417Z"></path> </mask> <path d="M101.529 69.4417H115.529V64.4417H101.529V69.4417Z" fill="#FFF8E0"></path> <path d="M101.529 68.4417H115.529V70.4417H101.529V68.4417Z" fill="#FECE25" mask="url(#path-24-inside-8_814_9110)"></path> </g> <g id="Rectangle 1711_3"> <mask id="path-26-inside-9_814_9110" fill="white"> <path d="M119.529 69.6989H135.529V64.4417H119.529V69.6989Z"></path> </mask> <path d="M119.529 69.6989H135.529V64.4417H119.529V69.6989Z" fill="#E0F5DC"></path> <path d="M119.529 68.6989H135.529V70.6989H119.529V68.6989Z" fill="#559A47" mask="url(#path-26-inside-9_814_9110)"></path> </g> </g> </g> <g id="Frame 15837_2"> <rect id="Rectangle 1709_7" width="24" height="3" transform="matrix(1 0 0 -1 87.5289 83.2131)" fill="#E3E8EC"></rect> <g id="Frame 15836_5"> <g id="Rectangle 1709_8"> <mask id="path-29-inside-10_814_9110" fill="white"> <path d="M87.5289 94.2131H109.529V89.2131H87.5289V94.2131Z"></path> </mask> <path d="M87.5289 94.2131H109.529V89.2131H87.5289V94.2131Z" fill="#F8E3DF"></path> <path d="M87.5289 93.2131H109.529V95.2131H87.5289V93.2131Z" fill="#B64638" mask="url(#path-29-inside-10_814_9110)"></path> </g> <g id="Rectangle 1710_4"> <mask id="path-31-inside-11_814_9110" fill="white"> <path d="M113.529 94.2131H119.529V89.2131H113.529V94.2131Z"></path> </mask> <path d="M113.529 94.2131H119.529V89.2131H113.529V94.2131Z" fill="#FFF8E0"></path> <path d="M113.529 93.2131H119.529V95.2131H113.529V93.2131Z" fill="#FECE25" mask="url(#path-31-inside-11_814_9110)"></path> </g> <g id="Rectangle 1711_4"> <mask id="path-33-inside-12_814_9110" fill="white"> <path d="M123.529 94.4703H135.529V89.2131H123.529V94.4703Z"></path> </mask> <path d="M123.529 94.4703H135.529V89.2131H123.529V94.4703Z" fill="#E0F5DC"></path> <path d="M123.529 93.4703H135.529V95.4703H123.529V93.4703Z" fill="#559A47" mask="url(#path-33-inside-12_814_9110)"></path> </g> </g> </g> </g> </g> <rect id="Rectangle 1708" width="50" height="4" transform="matrix(1 0 0 -1 28.8076 44.4417)" fill="#E3E8EC"></rect> </g> <defs> <clipPath id="clip0_814_9110"> <rect x="21.5" y="21.4417" width="120" height="90" rx="4" fill="white"></rect> </clipPath> </defs> </svg>',
		title: 'KPIs',
		text: 'See performance against your own KPIs, aggregated and per establishment, snapshots and trends.',
	},
	isHorizontal: false,
	hasShadow: true,
	canAccess: true
};

export const HorizontalCard = Template.bind({});
HorizontalCard.args = {
	card: {
		url: 'https://example.com',
		svg: '<svg width="127" height="89" viewBox="0 0 127 89" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="the-blob" fill-rule="evenodd" clip-rule="evenodd" d="M62.2311 84.9069C50.41 86.4346 37.9022 91.2087 27.3801 87.3323C16.6784 83.3898 13.3546 73.5462 8.89369 65.2574C4.37321 56.8579 -2.56513 47.9855 1.47428 39.1968C5.46439 30.5152 19.9676 27.9226 28.9718 21.5722C38.8026 14.6388 43.3241 1.57197 56.5348 0.3642C69.688 -0.838327 76.7763 11.2981 87.9754 16.1779C99.5429 21.2181 119.106 19.7123 123.038 29.3415C127.043 39.1479 110.45 47.3515 104.617 56.9329C100.139 64.2891 101.034 73.4905 92.8882 78.8667C84.6841 84.2813 72.8719 83.5318 62.2311 84.9069Z" fill="#E1E8EE"></path> <g clip-path="url(#clip0_592_3258)"> <rect width="90" height="71" transform="translate(13.5 7)" fill="white"></rect> <path d="M103.5 7H13.5V17H103.5V7Z" fill="black"></path> <path d="M103.5 7H13.5V17H103.5V7Z" fill="black"></path> <path d="M103.5 7H13.5V17H103.5V7Z" fill="#2C3E4F"></path> <path d="M25.6951 27.3693C24.9763 27.9041 24.7832 28.751 24.8185 29.2016C24.8638 29.7527 24.9756 30.47 24.9756 30.47C24.9756 30.47 24.7542 30.5903 24.7542 31.0742C24.8313 32.2889 25.2373 31.7647 25.3208 32.2974C25.5217 33.5807 25.9809 33.3522 25.9809 34.0525C25.9809 35.2191 25.4998 35.7645 23.9979 36.4111C22.491 37.0606 20.9375 37.8777 20.9375 39.2926V40H33.6715V39.2926C33.6715 37.8777 32.1172 37.0606 30.6097 36.4119C29.1078 35.7652 28.6281 35.2205 28.6281 34.0532C28.6281 33.3529 29.0858 33.5814 29.2874 32.2981C29.3716 31.7654 29.777 32.2896 29.8555 31.0749C29.8555 30.591 29.6334 30.4707 29.6334 30.4707C29.6334 30.4707 29.7452 29.7534 29.7897 29.2023C29.8357 28.6243 29.5082 27.3905 28.1626 27.0121C27.927 26.7715 27.7679 26.3888 28.4923 26.0047C26.9076 25.9304 26.539 26.7595 25.6951 27.3693Z" fill="#96AEC4"></path> <path d="M25.6951 47.3693C24.9763 47.9041 24.7832 48.751 24.8185 49.2016C24.8638 49.7527 24.9756 50.47 24.9756 50.47C24.9756 50.47 24.7542 50.5903 24.7542 51.0742C24.8313 52.2889 25.2373 51.7647 25.3208 52.2974C25.5217 53.5807 25.9809 53.3522 25.9809 54.0525C25.9809 55.2191 25.4998 55.7645 23.9979 56.4111C22.491 57.0606 20.9375 57.8777 20.9375 59.2926V60H33.6715V59.2926C33.6715 57.8777 32.1172 57.0606 30.6097 56.4119C29.1078 55.7652 28.6281 55.2205 28.6281 54.0532C28.6281 53.3529 29.0858 53.5814 29.2874 52.2981C29.3716 51.7654 29.777 52.2896 29.8555 51.0749C29.8555 50.591 29.6334 50.4707 29.6334 50.4707C29.6334 50.4707 29.7452 49.7534 29.7897 49.2023C29.8357 48.6243 29.5082 47.3905 28.1626 47.0121C27.927 46.7715 27.7679 46.3888 28.4923 46.0047C26.9076 45.9304 26.539 46.7595 25.6951 47.3693Z" fill="#96AEC4"></path> <path d="M25.6951 69.3693C24.9763 69.9041 24.7832 70.751 24.8185 71.2016C24.8638 71.7527 24.9756 72.47 24.9756 72.47C24.9756 72.47 24.7542 72.5903 24.7542 73.0742C24.8313 74.2889 25.2373 73.7647 25.3208 74.2974C25.5217 75.5807 25.9809 75.3522 25.9809 76.0525C25.9809 77.2191 25.4998 77.7645 23.9979 78.4111C22.491 79.0606 20.9375 79.8777 20.9375 81.2926V82H33.6715V81.2926C33.6715 79.8777 32.1172 79.0606 30.6097 78.4119C29.1078 77.7652 28.6281 77.2205 28.6281 76.0532C28.6281 75.3529 29.0858 75.5814 29.2874 74.2981C29.3716 73.7654 29.777 74.2896 29.8555 73.0749C29.8555 72.591 29.6334 72.4707 29.6334 72.4707C29.6334 72.4707 29.7452 71.7534 29.7897 71.2023C29.8357 70.6243 29.5082 69.3905 28.1626 69.0121C27.927 68.7715 27.7679 68.3888 28.4923 68.0047C26.9076 67.9304 26.539 68.7595 25.6951 69.3693Z" fill="#96AEC4"></path> <path d="M58.5 29H37.5V33H58.5V29Z" fill="#C3D1DD"></path> <path d="M66.5 35H37.5V39H66.5V35Z" fill="#E1E8EE"></path> <path d="M58.5 49H37.5V53H58.5V49Z" fill="#C3D1DD"></path> <path d="M66.5 55H37.5V59H66.5V55Z" fill="#E1E8EE"></path> <path d="M58.5 71H37.5V75H58.5V71Z" fill="#C3D1DD"></path> <path d="M66.5 77H37.5V81H66.5V77Z" fill="#E1E8EE"></path> </g> <path d="M98.7209 38.6348C97.8995 39.246 97.6787 40.2138 97.7192 40.7288C97.7709 41.3586 97.8986 42.1784 97.8986 42.1784C97.8986 42.1784 97.6456 42.3159 97.6456 42.8689C97.7337 44.2571 98.1978 43.658 98.2932 44.2668C98.5228 45.7334 99.0475 45.4723 99.0475 46.2727C99.0475 47.6059 98.4977 48.2293 96.7813 48.9683C95.0592 49.7105 93.2837 50.6443 93.2837 52.2613V53.0698H107.837V52.2613C107.837 50.6443 106.061 49.7105 104.338 48.9691C102.621 48.2301 102.073 47.6076 102.073 46.2735C102.073 45.4731 102.596 45.7342 102.826 44.2676C102.923 43.6588 103.386 44.2579 103.476 42.8697C103.476 42.3167 103.222 42.1792 103.222 42.1792C103.222 42.1792 103.35 41.3594 103.401 40.7296C103.453 40.069 103.079 38.659 101.541 38.2265C101.272 37.9516 101.09 37.5142 101.918 37.0752C100.107 36.9903 99.6854 37.9378 98.7209 38.6348Z" fill="#EEF7FF"></path> <path d="M100.784 62.0698C103.949 62.0698 107.042 61.1312 109.674 59.3728C112.305 57.6143 114.356 55.1149 115.567 52.1908C116.777 49.2667 117.094 46.0492 116.476 42.9453C115.858 39.8414 114.333 36.9905 112.094 34.7532C109.856 32.5159 107.004 30.9927 103.9 30.3763C100.796 29.7598 97.5785 30.0779 94.655 31.2901C91.7315 32.5024 89.2332 34.5545 87.4761 37.1868C85.719 39.819 84.7821 42.9133 84.7837 46.0781C84.7837 48.1789 85.1976 50.2591 86.0018 52.1998C86.806 54.1405 87.9846 55.9038 89.4705 57.3889C90.9563 58.874 92.7202 60.0517 94.6614 60.8549C96.6025 61.6581 98.6829 62.0709 100.784 62.0698Z" fill="#225C94"></path> <path d="M99.0808 38.9947C98.2593 39.606 98.0386 40.5738 98.079 41.0888C98.1308 41.7186 98.2585 42.5384 98.2585 42.5384C98.2585 42.5384 98.0054 42.6759 98.0054 43.2289C98.0936 44.6171 98.5577 44.018 98.6531 44.6268C98.8827 46.0934 99.4074 45.8323 99.4074 46.6327C99.4074 47.9659 98.8576 48.5893 97.1412 49.3283C95.419 50.0705 93.6436 51.0043 93.6436 52.6213V53.4298H108.197V52.6213C108.197 51.0043 106.42 50.0705 104.697 49.3291C102.981 48.5901 102.433 47.9675 102.433 46.6335C102.433 45.8331 102.956 46.0942 103.186 44.6276C103.283 44.0188 103.746 44.6179 103.836 43.2297C103.836 42.6767 103.582 42.5392 103.582 42.5392C103.582 42.5392 103.709 41.7194 103.76 41.0896C103.813 40.429 103.439 39.019 101.901 38.5864C101.632 38.3116 101.45 37.8742 102.278 37.4351C100.467 37.3502 100.045 38.2978 99.0808 38.9947Z" fill="#EEF7FF"></path> <defs> <clipPath id="clip0_592_3258"> <rect width="90" height="71" fill="white" transform="translate(13.5 7)"></rect> </clipPath> </defs> </svg>',
		title: 'Example Title',
		text: 'This is an example description for the card.',
	},
	isHorizontal: true,
	hasShadow: false,
	canAccess: true
};


