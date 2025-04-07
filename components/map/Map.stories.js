import Map from "./Map.vue";

export default {
	title: "Components/Map/Map",
	component: Map,
};

const Template = (args, { argTypes }) => ({
	components: { Map },
	props: Object.keys(argTypes),
	template: '<Map v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
	lat: 53.4084,
	lng: -2.9916,
	zoom: 13,
	mapHeight: "95dvh",
	mapWidth: "100%",
	markers: [
		{
			lat: 53.3863,
			lng: -3.1765,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "West Kirby Grammar School",
            id: "0a06195f-17e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.372,
			lng: -3.1419,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Calday Grange Grammar School",
            id: "0a06195f-27e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.389,
			lng: -3.051,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "St Anselm’s College",
            id: "0a06195f-307e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.378,
			lng: -3.079,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Upton Hall School FCJ",
            id: "0a06195f-0741-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.358,
			lng: -3.049,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Wirral Grammar School for Boys",
            id: "0a06195f-07e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.357,
			lng: -3.051,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Wirral Grammar School for Girls",
            id: "0a06195f-07e0-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.397,
			lng: -2.916,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "The Blue Coat School",
            id: "0a06195f-07e1-4f48-b38c-3d7d64bd5c19"
		},
		{
			lat: 53.388,
			lng: -2.913,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Liverpool College",
            id: "0a06195f-07e1-4f48-b38c-3q7d64bd5c19"
		},
		{
			lat: 53.408,
			lng: -2.919,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "King David High School",
            id: "0a06195f-07e1-4f48-b38c-347d64ad5c19"
		},
		{
			lat: 53.3921,
			lng: -3.0658,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Seaview Academy",
            id: "0a06195f-07e1-4f48-b38c-447d64bd5c19"
		},
		{
			lat: 53.4042,
			lng: -3.0135,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Birchwood High",
            id: "0a06195f-07e1-4f48-b38c-347d64b15c19"
		},
		{
			lat: 53.3824,
			lng: -2.9921,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Kingsland Secondary School",
            id: "0a06195f-07e1-4f48-b38c-348d64bd5c19"
		},
		{
			lat: 53.4206,
			lng: -3.0751,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Northgate School",
            id: "0a06195f-07e1-4b48-b38c-347d64bd5c19"
		},
		{
			lat: 53.3758,
			lng: -3.0984,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Elmbridge College",
            id: "0a06195f-07e1-sf48-b38c-347d64bd5c19"
		},
		{
			lat: 53.4082,
			lng: -2.9919,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Meadowhill Academy",
            id: "0a06195f-07e1-4f48-bt8c-347d64bd5c19"
		},
		{
			lat: 53.439,
			lng: -3.035,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Springfield Grammar",
            id: "0v06195f-07e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.4302,
			lng: -3.0011,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Claremont Park School",
            id: "0a061y5f-07e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.3542,
			lng: -2.9745,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Highfields Learning Centre",
            id: "0a0619lf-07e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.3907,
			lng: -3.0249,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Oakdene School",
            id: "0a06195f-07e1-4f48-b38c-347d61bd5c19"
		},
		{
			lat: 53.4113,
			lng: -3.0924,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Riverbank Academy",
            id: "0a06195f-07e1-4f48-b38c-347d6nbd5c19"
		},
		{
			lat: 53.3951,
			lng: -3.1452,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Ashcroft High",
            id: "0a06195f-07e1-4f48-b38c-347d6kbd5c19"
		},
		{
			lat: 53.3849,
			lng: -2.9611,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Brookvale School",
            id: "0a06195f-07e1-4f48-b38c-347d64bl5c19"
		},
		{
			lat: 53.3712,
			lng: -3.0267,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Hillgrove Academy",
            id: "0a06195f-07e1-4f48-b38c-347d6ebd5c19"
		},
		{
			lat: 53.4054,
			lng: -3.0023,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Lakeside Technical School",
            id: "0a06195f-27e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.4176,
			lng: -2.9801,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Eastfield Secondary",
            id: "0a06195f-07e1-4f48-b38c-347d62bd5c19"
		},
		{
			lat: 53.3998,
			lng: -3.1213,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Wavertree High",
            id: "0a06195f-07e1-4148-b38c-347d64bd5c19"
		},
		{
			lat: 53.3766,
			lng: -2.9452,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Newlands Academy",
            id: "0a06195f-07e1-4548-b38c-347d64bd5c19"
		},
		{
			lat: 53.3603,
			lng: -3.0027,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Southgate School",
            id: "0a06195f-07e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.4234,
			lng: -3.0621,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#61B752",
			popup: "Greendale College",
            id: "0a06195f-07e1-4f48-b38c-347d64b45c19"
		},
		{
			lat: 53.3921,
			lng: -3.0658,
			rollSize: "sm",
			balance: "neutral",
			phase: "P",
			hexColor: "#698BAB",
			popup: "Seaview Academy",
            id: "0a06195f-07e1-4f48-b38c-347d64bh5c19"
		},
		{
			lat: 53.4042,
			lng: -3.0135,
			rollSize: "md",
			balance: "positive",
			phase: "A",
			hexColor: "#61B752",
			popup: "Birchwood High",
            id: "0a06195f-07e1-4f48-b38c-347d6mbd5c19"
		},
		{
			lat: 53.3824,
			lng: -2.9921,
			rollSize: "lg",
			balance: "negative",
			phase: "SP",
			hexColor: "#B64638",
			popup: "Kingsland Secondary School",
            id: "0a06195f-07e1-4f48-b38c-347do4bd5c19"
		},
		{
			lat: 53.4206,
			lng: -3.0751,
			rollSize: "sm",
			balance: "neutral",
			phase: "N",
			hexColor: "#698BAB",
			popup: "Northgate School",
            id: "0a06195f-07e1-4f48-b38c-347d6pbd5c19"
		},
		{
			lat: 53.3758,
			lng: -3.0984,
			rollSize: "md",
			balance: "positive",
			phase: "S",
			hexColor: "#61B752",
			popup: "Elmbridge College",
            id: "0a06195f-07e1-4f48-b38c-347d64bd5k19"
		},
		{
			lat: 53.4082,
			lng: -2.9919,
			rollSize: "lg",
			balance: "negative",
			phase: "P",
			hexColor: "#B64638",
			popup: "Meadowhill Academy",
            id: "0a06195f-07e1-4f48-b38c-347d64zd5c19"
		},
		{
			lat: 53.439,
			lng: -3.035,
			rollSize: "sm",
			balance: "neutral",
			phase: "A",
			hexColor: "#698BAB",
			popup: "Springfield Grammar",
            id: "0a061z5f-07e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.4302,
			lng: -3.0011,
			rollSize: "md",
			balance: "positive",
			phase: "SP",
			hexColor: "#61B752",
			popup: "Claremont Park School",
            id: "0a06195f-07e1-4f48-b3zc-347d64bd5c19"
		},
		{
			lat: 53.3542,
			lng: -2.9745,
			rollSize: "lg",
			balance: "negative",
			phase: "N",
			hexColor: "#B64638",
			popup: "Highfields Learning Centre",
            id: "0a06195f-07e1-4f18-b38c-347d64bd5c19"
		},
		{
			lat: 53.3907,
			lng: -3.0249,
			rollSize: "sm",
			balance: "neutral",
			phase: "S",
			hexColor: "#698BAB",
			popup: "Oakdene School",
            id: "0a06195f-07e1-4f78-b38c-347d64bd5c19"
		},
		{
			lat: 53.4113,
			lng: -3.0924,
			rollSize: "md",
			balance: "positive",
			phase: "A",
			hexColor: "#61B752",
			popup: "Riverbank Academy",
            id: "0a06195f-07e1-4fu8-b38c-347d64bd5c19"
		},
		{
			lat: 53.3951,
			lng: -3.1452,
			rollSize: "lg",
			balance: "negative",
			phase: "P",
			hexColor: "#B64638",
			popup: "Ashcroft High",
            id: "0au6195f-07e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.3849,
			lng: -2.9611,
			rollSize: "sm",
			balance: "neutral",
			phase: "SP",
			hexColor: "#698BAB",
			popup: "Brookvale School",
            id: "0a06195f-07e1-4f4u-b38c-347d64bd5c19"
		},
		{
			lat: 53.3712,
			lng: -3.0267,
			rollSize: "md",
			balance: "positive",
			phase: "N",
			hexColor: "#61B752",
			popup: "Hillgrove Academy",
            id: "0a06195f-07e1-4f48-b38c-3u7d64bd5c19"
		},
		{
			lat: 53.4054,
			lng: -3.0023,
			rollSize: "lg",
			balance: "negative",
			phase: "S",
			hexColor: "#B64638",
			popup: "Lakeside Technical School",
            id: "0a06195f-07e1-4f48-b38c-347d64bduc19"
		},
		{
			lat: 53.4176,
			lng: -2.9801,
			rollSize: "sm",
			balance: "neutral",
			phase: "P",
			hexColor: "#698BAB",
			popup: "Eastfield Secondary",
            id: "0a06195f-07e1-4f48-b38c-347d64bd5c1u"
		},
		{
			lat: 53.3998,
			lng: -3.1213,
			rollSize: "md",
			balance: "positive",
			phase: "SP",
			hexColor: "#61B752",
			popup: "Wavertree High",
            id: "0a06195f-07e1-4f48-b38c-347164bd5c19"
		},
		{
			lat: 53.3766,
			lng: -2.9452,
			rollSize: "lg",
			balance: "negative",
			phase: "A",
			hexColor: "#B64638",
			popup: "Newlands Academy",
            id: "0a06195f-07e1-4f48-b38c-347d623d5c19"
		},
		{
			lat: 53.3603,
			lng: -3.0027,
			rollSize: "sm",
			balance: "neutral",
			phase: "N",
			hexColor: "#698BAB",
			popup: "Southgate School",
            id: "0a06195f-07e1-4238-b38c-347d64bd5c19"
		},
		{
			lat: 53.4234,
			lng: -3.0621,
			rollSize: "md",
			balance: "positive",
			phase: "S",
			hexColor: "#61B752",
			popup: "Greendale College",
            id: "0a06235f-07e1-4f48-b38c-347d64bd5c19"
		},
	],
};
