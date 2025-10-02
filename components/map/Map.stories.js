import Map from "./Map.vue";

export default {
  title: "Components/Map/Map",
  component: Map,
};

const Template = (args) => ({
  components: { Map },
  setup() {
    return { args };
  },
  template: '<Map v-bind="args" />',
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
			hexColor: "#F6D8E1",
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
			hexColor: "#F6BF58",
			popup: "St Anselm’s College",
            id: "0a06195f-307e1-4f48-b38c-347d64bd5c19"
		},
		{
			lat: 53.378,
			lng: -3.079,
			rollSize: "md",
			balance: "positive",
			phase: "P",
			hexColor: "#F6D8E1",
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
			hexColor: "#F6D8E1",
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
			hexColor: "#F6D8E1",
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
			hexColor: "#F6D8E1",
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
			hexColor: "#F6D8E1",
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
			hexColor: "#F6D8E1",
			popup: "Seaview Academy",
            id: "0a06195f-07e1-4f48-b38c-347d64bh5c19"
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
			hexColor: "#F6BF58z",
			popup: "Elmbridge College",
            id: "0a06195f-07e1-4f48-b38c-347d64bd5k19"
		},
		{
			lat: 53.4082,
			lng: -2.9919,
			rollSize: "lg",
			balance: "negative",
			phase: "P",
			hexColor: "#F6BF58",
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
			balance: "positive",
			phase: "N",
			hexColor: "#698BAB",
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
			hexColor: "#F6BF58",
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
			balance: "neutral",
			phase: "N",
			hexColor: "#F6D8E1",
			popup: "Hillgrove Academy",
            id: "0a06195f-07e1-4f48-b38c-3u7d64bd5c19"
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
			hexColor: "#F6BF58",
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
        {
            lat: 53.404587,
            lng: -2.849757,
            rollSize: "lg",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "North Huyton Grammar",
            id: "af863f38-2179-48a0-8c61-65af9873b268"
          },
          {
            lat: 53.356229,
            lng: -2.836797,
            rollSize: "lg",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "South Halewood School",
            id: "e006c801-56f2-41c1-8fb5-6e4d252277d7"
          },
          {
            lat: 53.407468,
            lng: -2.846035,
            rollSize: "md",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "St Huyton Grammar",
            id: "34932b04-a2eb-4e70-b45e-6d9b60c8089b"
          },
          {
            lat: 53.284704,
            lng: -2.723151,
            rollSize: "lg",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "New Frodsham Grammar",
            id: "dec98140-c297-4990-bfcb-5ba79a4db1e4"
          },
          {
            lat: 53.407418,
            lng: -2.840785,
            rollSize: "sm",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "South Huyton Grammar",
            id: "c6f248bb-7f2a-41d7-b0a6-dcf26ca42faa"
          },
          {
            lat: 53.366344,
            lng: -2.832246,
            rollSize: "lg",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "St Halewood Learning Centre",
            id: "21d2df39-40e9-494b-a531-dbd26b7dd037"
          },
          {
            lat: 53.30175,
            lng: -2.715888,
            rollSize: "sm",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "West Frodsham Learning Centre",
            id: "8d4f8afc-13da-4bc2-8c82-9eb78e870763"
          },
          {
            lat: 53.354033,
            lng: -2.823377,
            rollSize: "md",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "North Halewood School",
            id: "455b43fe-b448-4084-893e-eb5df46220cd"
          },
          {
            lat: 53.286987,
            lng: -2.887723,
            rollSize: "lg",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "West Ellesmere Port College",
            id: "378253c4-30db-4da6-b0bb-78e6329b0914"
          },
          {
            lat: 53.402167,
            lng: -2.580827,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "St Warrington School",
            id: "f01045b1-e42a-45e9-abe8-299d0fd5688b"
          },
          {
            lat: 53.288088,
            lng: -2.899768,
            rollSize: "md",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "South Ellesmere Port High",
            id: "22965099-71c1-42ae-b26a-7826e17fa800"
          },
          {
            lat: 53.368847,
            lng: -2.82646,
            rollSize: "lg",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "East Halewood High",
            id: "99c01d70-ef82-4e25-996f-4b69f7dbb466"
          },
          {
            lat: 53.386761,
            lng: -2.576774,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "East Warrington Academy",
            id: "3e50e496-a38c-4ee5-9100-af52d244ddf3"
          },
          {
            lat: 53.389741,
            lng: -2.58282,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "St Warrington Learning Centre",
            id: "6e283331-6ff1-47dc-9ac6-cbf30fd42d87"
          },
          {
            lat: 53.29985,
            lng: -2.718462,
            rollSize: "lg",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "West Frodsham School",
            id: "a12586ea-25f9-417a-9f8e-2730a60bbd4e"
          },
          {
            lat: 53.487069,
            lng: -2.249816,
            rollSize: "lg",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "West Manchester Grammar",
            id: "0363990a-3eb1-4c02-b88e-1edcfc87b525"
          },
          {
            lat: 53.483411,
            lng: -2.23743,
            rollSize: "sm",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "New Manchester Grammar",
            id: "c6f67bbf-7b5d-48bc-a0fa-cac20602ca08"
          },
          {
            lat: 53.476308,
            lng: -2.238182,
            rollSize: "sm",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "North Manchester Learning Centre",
            id: "b985778a-fcbb-42c2-b9bb-54f283303daa"
          },
          {
            lat: 53.284544,
            lng: -2.724791,
            rollSize: "sm",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "South Frodsham School",
            id: "a6f43188-37b1-43b0-bec3-414a952c06f3"
          },
          {
            lat: 53.387686,
            lng: -2.576033,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "West Warrington Grammar",
            id: "180b943e-443d-44c1-a787-23a985f7cf1e"
          },
          {
            lat: 53.279364,
            lng: -2.892908,
            rollSize: "lg",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "New Ellesmere Port High",
            id: "2f3ffeec-47c7-49a4-8363-e76e51151b8c"
          },
          {
            lat: 53.394913,
            lng: -2.578036,
            rollSize: "md",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "West Warrington Academy",
            id: "0b0f4c87-9eb3-42e2-a53c-8c8893d6da4d"
          },
          {
            lat: 53.292955,
            lng: -2.734855,
            rollSize: "lg",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "North Frodsham College",
            id: "97fc76b1-a378-44e6-a291-b30ededa2f2c"
          },
          {
            lat: 53.295426,
            lng: -2.718398,
            rollSize: "sm",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "North Frodsham Learning Centre",
            id: "a7390cd5-8eae-4318-b5bb-037cd84911a7"
          },
          {
            lat: 53.402649,
            lng: -2.851824,
            rollSize: "md",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "South Huyton College",
            id: "194fed82-53c7-4503-992b-1b3b968b2ef1"
          },
          {
            lat: 53.354584,
            lng: -2.825196,
            rollSize: "md",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "South Halewood Learning Centre",
            id: "fae9487f-28a4-4e41-94d1-7a05392b1f73"
          },
          {
            lat: 53.40389,
            lng: -2.837457,
            rollSize: "lg",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "North Huyton Academy",
            id: "3133219f-508c-4ccb-a4cb-6f68f5274c74"
          },
          {
            lat: 53.382683,
            lng: -2.587215,
            rollSize: "sm",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "West Warrington School",
            id: "ae6fe9c6-659a-49c9-b993-f2700daffed9"
          },
          {
            lat: 53.396889,
            lng: -2.57238,
            rollSize: "lg",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "St Warrington High",
            id: "72650b03-a724-4fdd-845e-7220a0da445c"
          },
          {
            lat: 53.481195,
            lng: -2.244008,
            rollSize: "sm",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "North Manchester School",
            id: "3a93483b-cfa6-40de-be40-0be65dcc9673"
          },
          {
            lat: 53.277729,
            lng: -2.907038,
            rollSize: "lg",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "New Ellesmere Port College",
            id: "6d847c7c-3070-489c-a576-9a7330db5e5f"
          },
          {
            lat: 53.384295,
            lng: -2.57027,
            rollSize: "md",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "East Warrington High",
            id: "79090039-8e51-4b6c-af4d-5658e3047fab"
          },
          {
            lat: 53.401618,
            lng: -2.841214,
            rollSize: "md",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "New Huyton Academy",
            id: "05d386fd-8522-429a-9eb8-9cc5e1ab9de2"
          },
          {
            lat: 53.48612,
            lng: -2.251902,
            rollSize: "md",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "New Manchester Grammar",
            id: "7153fbc5-59cf-4977-8ba0-dedf8986de33"
          },
          {
            lat: 53.401799,
            lng: -2.844244,
            rollSize: "lg",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "South Huyton Learning Centre",
            id: "91f2fd10-8728-4276-827d-b63981af3f52"
          },
          {
            lat: 53.485787,
            lng: -2.250695,
            rollSize: "md",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "St Manchester High",
            id: "4fb8ce04-a0f4-4ef0-9e0f-c37b34f47b76"
          },
          {
            lat: 53.404734,
            lng: -2.844063,
            rollSize: "sm",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "New Huyton School",
            id: "d6e64038-986e-4199-8286-0e7c0ae5c59a"
          },
          {
            lat: 53.412448,
            lng: -2.852756,
            rollSize: "md",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "South Huyton School",
            id: "12589dd6-f3b7-423c-85c9-e7d52973b98d"
          },
          {
            lat: 53.47481,
            lng: -2.236489,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "New Manchester College",
            id: "aab417ff-a73f-4906-881b-fc7c0347bad7"
          },
          {
            lat: 53.281654,
            lng: -2.893315,
            rollSize: "sm",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "South Ellesmere Port High",
            id: "00c53a3e-98db-42f9-a64c-aedeaa8a059f"
          },
          {
            lat: 53.412508,
            lng: -2.850971,
            rollSize: "lg",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "North Huyton School",
            id: "46f58213-24b0-4ab4-8935-15e7e1ccf184"
          },
          {
            lat: 53.409659,
            lng: -2.83544,
            rollSize: "md",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "West Huyton High",
            id: "a25f5fc8-b995-4942-a556-47e758ad78b7"
          },
          {
            lat: 53.402058,
            lng: -2.582897,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "North Warrington Academy",
            id: "9b39c2bc-dbbc-458f-bcee-4c0073049eff"
          },
          {
            lat: 53.282839,
            lng: -2.893136,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "St Ellesmere Port High",
            id: "cdd44dd6-9a1e-41ec-881c-e626bdfc0843"
          },
          {
            lat: 53.476599,
            lng: -2.237164,
            rollSize: "lg",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "New Manchester Academy",
            id: "4fb0915b-e7eb-470d-8aeb-10639919ab00"
          },
          {
            lat: 53.354305,
            lng: -2.834527,
            rollSize: "lg",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "East Halewood Learning Centre",
            id: "2aa95f83-b42f-4c25-b084-1ef47714305a"
          },
          {
            lat: 53.361827,
            lng: -2.820691,
            rollSize: "lg",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "New Halewood School",
            id: "f7e60598-34c9-4c9a-a91e-0ab922543e32"
          },
          {
            lat: 53.283049,
            lng: -2.902074,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "New Ellesmere Port Grammar",
            id: "7a0e5f49-6b26-4664-8486-36b546392abd"
          },
          {
            lat: 53.364056,
            lng: -2.831513,
            rollSize: "md",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "North Halewood Grammar",
            id: "81685ae7-cd51-4bdc-b8e8-f3b6c1541a99"
          },
          {
            lat: 53.302602,
            lng: -2.716413,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "St Frodsham Grammar",
            id: "0235b241-3707-41f8-bbfc-5e81a09304f3"
          },
          {
            lat: 53.279555,
            lng: -2.896223,
            rollSize: "md",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "East Ellesmere Port College",
            id: "bd6214d4-a319-4bb9-9291-449a9ad0d035"
          },
          {
            lat: 53.300768,
            lng: -2.728093,
            rollSize: "md",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "South Frodsham School",
            id: "9eea32c8-f164-425a-91a4-9991ebc2e785"
          },
          {
            lat: 53.355695,
            lng: -2.836678,
            rollSize: "lg",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "South Halewood Learning Centre",
            id: "0ef9ff47-5639-4a59-afca-51b0211ce114"
          },
          {
            lat: 53.39833,
            lng: -2.584779,
            rollSize: "sm",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "St Warrington Academy",
            id: "56b9a919-9ee9-4808-bd21-3948c9ab8616"
          },
          {
            lat: 53.478331,
            lng: -2.24749,
            rollSize: "lg",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "New Manchester Learning Centre",
            id: "0b2d2f9d-fe24-4041-bd25-ebf2dd37da22"
          },
          {
            lat: 53.36171,
            lng: -2.835336,
            rollSize: "sm",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "West Halewood Grammar",
            id: "27630ff3-bd9d-440c-8d50-1065cecaa28f"
          },
          {
            lat: 53.421022,
            lng: -2.84978,
            rollSize: "sm",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "St Huyton Academy",
            id: "b8558b3d-9134-484c-aa10-49105c66868b"
          },
          {
            lat: 53.371058,
            lng: -2.834295,
            rollSize: "md",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "New Halewood Learning Centre",
            id: "4435981c-d8bb-45a3-9599-9df9ee5cb534"
          },
          {
            lat: 53.286789,
            lng: -2.731334,
            rollSize: "lg",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "South Frodsham Learning Centre",
            id: "70146752-c8db-4004-814c-fe3a83e611e3"
          },
          {
            lat: 53.400955,
            lng: -2.587037,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "St Warrington College",
            id: "fda5357f-5520-4896-a7e5-9ea37c7d640d"
          },

          {
            lat: 53.338926,
            lng: -2.727426,
            rollSize: "lg",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "North Runcorn College",
            id: "4ca456d7-a33c-4417-92ce-bdaeaf5c7edd"
          },
          {
            lat: 53.455452,
            lng: -2.62382,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "South Newton-le-Willows Academy",
            id: "9ef705de-e6f7-4b5e-b38d-3b7c1f94bd9f"
          },
          {
            lat: 53.321151,
            lng: -2.966537,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "West Bromborough High",
            id: "0bd0d8bf-3642-4804-bf3d-86f97c4792fd"
          },
          {
            lat: 53.339807,
            lng: -2.733202,
            rollSize: "md",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "North Runcorn School",
            id: "c0541a14-d00b-4519-bfca-5a9a37465dae"
          },
          {
            lat: 53.311093,
            lng: -2.968022,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "St Bromborough Grammar",
            id: "e0b12333-4d8c-43db-b7fe-0b5f89bfdf1a"
          },
          {
            lat: 53.32957,
            lng: -2.972729,
            rollSize: "md",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "St Bromborough School",
            id: "9355c50e-1a26-49db-a353-3d5130a7c05c"
          },
          {
            lat: 53.444947,
            lng: -2.731348,
            rollSize: "sm",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "New St Helens Academy",
            id: "49750ec5-d05c-4ee0-944c-08b9344dc9fa"
          },
          {
            lat: 53.341088,
            lng: -2.741086,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "West Runcorn Learning Centre",
            id: "8e3c83ba-aa34-4f2d-8db9-940c2d557987"
          },
          {
            lat: 53.262312,
            lng: -2.510486,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "New Northwich School",
            id: "2051f5ac-bb85-463e-a7cb-5c236fdf08ee"
          },
          {
            lat: 53.335004,
            lng: -2.730876,
            rollSize: "md",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "North Runcorn Grammar",
            id: "bd026a53-abe9-40cc-b9e0-5a397d382050"
          },
          {
            lat: 53.329277,
            lng: -2.975101,
            rollSize: "lg",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "St Bromborough High",
            id: "8abc245b-751a-4553-a11c-edca2a82b213"
          },
          {
            lat: 53.259324,
            lng: -2.530253,
            rollSize: "lg",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "North Northwich Grammar",
            id: "cde401ae-1996-4c49-87e4-b3cfbab80f67"
          },
          {
            lat: 53.452077,
            lng: -2.618053,
            rollSize: "md",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "South Newton-le-Willows High",
            id: "218646a6-475c-4f13-9c88-7e920d5ce44a"
          },
          {
            lat: 53.450419,
            lng: -2.633284,
            rollSize: "sm",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "South Newton-le-Willows High",
            id: "afd816f8-4e43-4f7a-9ad1-e5c359f72ad1"
          },
          {
            lat: 53.317428,
            lng: -2.9748,
            rollSize: "sm",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "North Bromborough Academy",
            id: "bc731ef3-e434-4c76-aca9-df9525c66433"
          },
          {
            lat: 53.453394,
            lng: -2.740546,
            rollSize: "lg",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "New St Helens Academy",
            id: "5b682adf-0e4d-4f97-aa00-ea1757f3567a"
          },
          {
            lat: 53.460097,
            lng: -2.740011,
            rollSize: "lg",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "West St Helens College",
            id: "8f57fcfb-b0c9-46b4-a2ae-e73cc639f94e"
          },
          {
            lat: 53.250048,
            lng: -2.514011,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "New Northwich College",
            id: "ca88e171-266c-40f1-a5ea-96285b5b1ce2"
          },
          {
            lat: 53.448071,
            lng: -2.633322,
            rollSize: "sm",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "South Newton-le-Willows Academy",
            id: "2cbafa2d-36cf-42e2-b882-b54f85b33686"
          },
          {
            lat: 53.455668,
            lng: -2.736659,
            rollSize: "lg",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "New St Helens High",
            id: "db9bb238-9b3d-4515-bf67-4c6bb1d6be92"
          },
          {
            lat: 53.251876,
            lng: -2.523871,
            rollSize: "sm",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "South Northwich College",
            id: "6948fc56-877b-41ab-9fca-bc70fc7fd410"
          },
          {
            lat: 53.311421,
            lng: -2.969872,
            rollSize: "md",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "New Bromborough High",
            id: "9a4803f7-c3ac-4897-a015-4cb19d9cfc73"
          },
          {
            lat: 53.315845,
            lng: -2.974151,
            rollSize: "lg",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "St Bromborough College",
            id: "d60901fa-1d68-4d56-83ba-8b2adbf07a66"
          },
          {
            lat: 53.344961,
            lng: -2.723418,
            rollSize: "md",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "New Runcorn Academy",
            id: "77e54c4a-e037-4f91-9570-44666bfeae6b"
          },
          {
            lat: 53.459637,
            lng: -2.617184,
            rollSize: "sm",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "East Newton-le-Willows High",
            id: "7c722945-1e8c-433d-aa85-b94aa38e9474"
          },
          {
            lat: 53.351592,
            lng: -2.734183,
            rollSize: "md",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "West Runcorn Academy",
            id: "cc4afcae-aecb-45d0-b8a6-ea41a27fc889"
          },
          {
            lat: 53.316726,
            lng: -2.976186,
            rollSize: "lg",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "New Bromborough College",
            id: "3a5e315c-9656-4f68-8ccb-c965ccfc157b"
          },
          {
            lat: 53.34845,
            lng: -2.732963,
            rollSize: "md",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "North Runcorn Learning Centre",
            id: "fd0c5b83-f9e7-4326-8535-1909684bc989"
          },
          {
            lat: 53.328832,
            lng: -2.981246,
            rollSize: "md",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "East Bromborough Grammar",
            id: "4df2cb94-16af-432e-93fd-341c576b9979"
          },
          {
            lat: 53.458742,
            lng: -2.740307,
            rollSize: "md",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "New St Helens School",
            id: "c6093dd0-764b-44c3-b0a9-8bd906d45d4e"
          },
          {
            lat: 53.345639,
            lng: -2.724707,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "East Runcorn Academy",
            id: "1469b46b-d347-422c-a9ba-71dc3a203053"
          },
          {
            lat: 53.25581,
            lng: -2.523709,
            rollSize: "lg",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "St Northwich Learning Centre",
            id: "b345bc3b-43aa-4826-b8be-a5133004b722"
          },
          {
            lat: 53.311039,
            lng: -2.972338,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "South Bromborough Academy",
            id: "445a7474-9422-4279-b2fa-8d6f05d4d016"
          },
          {
            lat: 53.34687,
            lng: -2.726627,
            rollSize: "lg",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "West Runcorn School",
            id: "c119b695-229f-423d-b919-d842d2f5bd74"
          },
          {
            lat: 53.452224,
            lng: -2.629937,
            rollSize: "lg",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "St Newton-le-Willows College",
            id: "a3f3fbdb-8a1a-46f1-a723-f62fed649cf9"
          },
          {
            lat: 53.316381,
            lng: -2.968652,
            rollSize: "md",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "St Bromborough College",
            id: "e77141df-a80f-41a6-90d5-462cdb4b34ea"
          },
          {
            lat: 53.451544,
            lng: -2.738069,
            rollSize: "lg",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "South St Helens School",
            id: "c3dfc918-d9ae-4e2a-ab4b-3cb0ee1deaed"
          },
          {
            lat: 53.458542,
            lng: -2.738312,
            rollSize: "sm",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "St St Helens Grammar",
            id: "b59b82f5-9816-44be-8c35-6ae946587cb7"
          },
          {
            lat: 53.461453,
            lng: -2.735303,
            rollSize: "sm",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "St St Helens Learning Centre",
            id: "63d167dd-424a-4581-8cc9-80ef297f6ccf"
          },
          {
            lat: 53.45908,
            lng: -2.634358,
            rollSize: "md",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "West Newton-le-Willows Academy",
            id: "14dfc655-1fe9-49b8-81ac-9e9d6a11f65a"
          },
          {
            lat: 53.330368,
            lng: -2.983402,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "East Bromborough School",
            id: "80e8dda5-161c-4957-8a1d-3a48d3d78b1d"
          },
          {
            lat: 53.451508,
            lng: -2.739194,
            rollSize: "sm",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "North St Helens College",
            id: "a153ef25-13dd-4775-bb11-da4228c1126f"
          },
          {
            lat: 53.322024,
            lng: -2.966608,
            rollSize: "lg",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "North Bromborough High",
            id: "8abc7c4d-9550-4193-a8f9-0f6e5175b20a"
          },
          {
            lat: 53.453592,
            lng: -2.616735,
            rollSize: "sm",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "West Newton-le-Willows High",
            id: "fcbec833-d771-4bd0-a6d9-00646c9b958d"
          },
          {
            lat: 53.332896,
            lng: -2.729896,
            rollSize: "sm",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "St Runcorn School",
            id: "763aadfb-6309-4c28-9305-c8e15773513d"
          },
          {
            lat: 53.313866,
            lng: -2.980505,
            rollSize: "lg",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "St Bromborough School",
            id: "886ede7a-b0b4-4739-bc7b-5daac32d95fc"
          },
          {
            lat: 53.329025,
            lng: -2.972191,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "New Bromborough School",
            id: "85e2c359-b0c8-45a9-b771-5438bc102cfa"
          },
          {
            lat: 53.261568,
            lng: -2.520143,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "West Northwich Grammar",
            id: "3e6d7b65-a18c-4233-bcf2-3b2313c465c9"
          },
          {
            lat: 53.338545,
            lng: -2.734182,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "North Runcorn Grammar",
            id: "0c06cfd1-ef0a-453e-a1aa-9d968a109809"
          },
          {
            lat: 53.461582,
            lng: -2.735809,
            rollSize: "lg",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "North St Helens Learning Centre",
            id: "86a8449e-31d9-4e3c-8a5a-27650685e9bb"
          },
          {
            lat: 53.394542,
            lng: -2.574846,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "New Warrington Learning Centre",
            id: "a0362be8-6431-4db7-aeb8-d1ac643a9c67"
          },
          {
            lat: 53.297827,
            lng: -2.720042,
            rollSize: "md",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "East Frodsham College",
            id: "a5f89bea-fadb-4c1f-be6b-5127f2b457c1"
          },
          {
            lat: 53.271251,
            lng: -2.896691,
            rollSize: "lg",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "St Ellesmere Port School",
            id: "e77b9fd1-9f05-4dd9-82c1-b517230d0233"
          },
          {
            lat: 53.349535,
            lng: -2.732569,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "North Runcorn High",
            id: "68a4a4bf-258a-42a5-97f3-cfe6d835ec7a"
          },
          {
            lat: 53.459325,
            lng: -2.727791,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "South St Helens Grammar",
            id: "6ac24d57-954c-4db6-afd8-f8457efa7863"
          },
          {
            lat: 53.283407,
            lng: -2.904273,
            rollSize: "lg",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "St Ellesmere Port High",
            id: "da95310b-6b3f-4004-aac5-70343e959fa3"
          },
          {
            lat: 53.273289,
            lng: -2.90463,
            rollSize: "lg",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "East Ellesmere Port School",
            id: "49f7f94c-4cfe-46f6-b59d-896f842d6f04"
          },
          {
            lat: 53.248827,
            lng: -2.513462,
            rollSize: "md",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "East Northwich College",
            id: "2bb8c7c4-7ae4-4bfe-bb27-bed5eb84afdd"
          },
          {
            lat: 53.46103,
            lng: -2.734411,
            rollSize: "md",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "West St Helens Academy",
            id: "8e6653ba-1daa-4fc7-a738-89edf98abbbb"
          },
          {
            lat: 53.311878,
            lng: -2.970897,
            rollSize: "md",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "West Bromborough School",
            id: "31c42b37-0eb2-4ea7-9822-99b05bd16e45"
          },
          {
            lat: 53.449326,
            lng: -2.631647,
            rollSize: "md",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "St Newton-le-Willows Learning Centre",
            id: "6d38217e-6862-4585-ae71-4800972a4ad1"
          },
          {
            lat: 53.284668,
            lng: -2.727671,
            rollSize: "sm",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "West Frodsham Learning Centre",
            id: "172b2b31-1cb7-420b-8437-f60528d704de"
          },
          {
            lat: 53.248574,
            lng: -2.511834,
            rollSize: "sm",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "St Northwich Academy",
            id: "a02f7d21-4355-446e-b5d7-bbfcf65e6931"
          },
          {
            lat: 53.275532,
            lng: -2.897063,
            rollSize: "lg",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "North Ellesmere Port Academy",
            id: "98056b6f-2b73-4704-8bf9-3b19fc6adcf5"
          },
          {
            lat: 53.258571,
            lng: -2.51038,
            rollSize: "md",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "North Northwich High",
            id: "9fd96d72-9077-456c-85ce-b92c34aa7316"
          },
          {
            lat: 53.275038,
            lng: -2.907172,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "New Ellesmere Port Grammar",
            id: "95daca3a-a946-49aa-a344-fa5826fae94f"
          },
          {
            lat: 53.327007,
            lng: -2.979552,
            rollSize: "sm",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "South Bromborough Grammar",
            id: "a86b0a2c-8b9a-40c6-86d8-146992f2888a"
          },
          {
            lat: 53.357205,
            lng: -2.82277,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "East Halewood Grammar",
            id: "fe65d3c2-bbff-416e-8a74-d4cec6284e3a"
          },
          {
            lat: 53.326318,
            lng: -2.985848,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "St Bromborough Grammar",
            id: "6d95257c-cb32-462b-9b67-57096ca3f8ec"
          },
          {
            lat: 53.486591,
            lng: -2.235781,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "St Manchester Learning Centre",
            id: "37858214-a12f-4aad-beb9-fc656adbff44"
          },
          {
            lat: 53.287722,
            lng: -2.732926,
            rollSize: "md",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "East Frodsham School",
            id: "38289e32-afc5-4ecb-8b9d-7f923befc851"
          },
          {
            lat: 53.344496,
            lng: -2.731533,
            rollSize: "sm",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "West Runcorn Learning Centre",
            id: "1a0aa831-8086-4632-869d-6c5787d3e302"
          },
          {
            lat: 53.31619,
            lng: -2.973659,
            rollSize: "sm",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "South Bromborough Academy",
            id: "98200175-66e3-4792-a0fa-88444dc191b1"
          },
          {
            lat: 53.490601,
            lng: -2.252189,
            rollSize: "lg",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "St Manchester High",
            id: "2fc62b1a-05fb-4d2d-8f33-04d3225d7706"
          },
          {
            lat: 53.284527,
            lng: -2.722407,
            rollSize: "sm",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "South Frodsham Learning Centre",
            id: "81e924ab-15e3-4116-9337-fa457acbbb1c"
          },
          {
            lat: 53.391825,
            lng: -2.572051,
            rollSize: "sm",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "East Warrington College",
            id: "d282147f-c0c6-4bbc-adcf-0e5345834e7b"
          },
          {
            lat: 53.312244,
            lng: -2.977579,
            rollSize: "md",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "West Bromborough College",
            id: "5fa714d4-65d3-448f-90a0-215f8b52913e"
          },
          {
            lat: 53.397143,
            lng: -2.589572,
            rollSize: "lg",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "New Warrington Learning Centre",
            id: "b458183d-c064-48c5-9a68-e5400c0ba93d"
          },
          {
            lat: 53.298016,
            lng: -2.726438,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "North Frodsham Academy",
            id: "4009fa78-e795-418d-b598-859200b7ca36"
          },
          {
            lat: 53.281899,
            lng: -2.907037,
            rollSize: "sm",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "South Ellesmere Port School",
            id: "57f4cd57-52ef-428b-8954-aa62a5b140c2"
          },
          {
            lat: 53.346611,
            lng: -2.734212,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "St Runcorn School",
            id: "831442d2-2306-4ec4-8325-2f1cb8772a45"
          },
          {
            lat: 53.398699,
            lng: -2.57183,
            rollSize: "lg",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "St Warrington College",
            id: "6e086636-bbc4-4876-8665-abd9d981418e"
          },
          {
            lat: 53.357091,
            lng: -2.82228,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "South Halewood Learning Centre",
            id: "184f4a39-b9de-426a-917f-be5499397408"
          },
          {
            lat: 53.401808,
            lng: -2.838459,
            rollSize: "lg",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "South Huyton Grammar",
            id: "17609268-048d-42f8-84a8-eb9397965953"
          },
          {
            lat: 53.301452,
            lng: -2.716275,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "East Frodsham Academy",
            id: "49bc901b-aa32-4027-a0c3-4f5b86cabb1e"
          },
          {
            lat: 53.330891,
            lng: -2.975793,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "St Bromborough Grammar",
            id: "e77530cb-1fe8-441f-a257-bc1051da3368"
          },
          {
            lat: 53.256703,
            lng: -2.515501,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "North Northwich High",
            id: "97a4f61d-8545-4d33-a163-5901f1d23737"
          },
          {
            lat: 53.258934,
            lng: -2.52377,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "North Northwich College",
            id: "3f6cfa04-0025-4ab2-a043-5513aaacab2f"
          },
          {
            lat: 53.280641,
            lng: -2.903446,
            rollSize: "sm",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "North Ellesmere Port Grammar",
            id: "ef36f7c4-f42b-4d8a-a302-792888c89110"
          },
          {
            lat: 53.479722,
            lng: -2.234969,
            rollSize: "lg",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "North Manchester Academy",
            id: "5b2bd90b-cabb-4138-985c-0f7fa3da20ff"
          },
          {
            lat: 53.477932,
            lng: -2.242506,
            rollSize: "md",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "East Manchester High",
            id: "b3da7c3d-95cb-4a4a-b391-85fa94e6c19a"
          },
          {
            lat: 53.276547,
            lng: -2.905376,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "East Ellesmere Port Academy",
            id: "fe458b5d-4efc-49b0-a529-a06e48e9d181"
          },
          {
            lat: 53.490659,
            lng: -2.241772,
            rollSize: "md",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "St Manchester Grammar",
            id: "158427e2-74de-478a-af2b-9cb94a74547f"
          },
          {
            lat: 53.270272,
            lng: -2.893622,
            rollSize: "md",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "North Ellesmere Port Learning Centre",
            id: "5fbdfe37-84fd-427d-8be5-33ab9f15c390"
          },
          {
            lat: 53.45621,
            lng: -2.628801,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "North Newton-le-Willows Learning Centre",
            id: "5e6baedf-06fb-4c35-b67c-3d31af3dadc9"
          },
          {
            lat: 53.441509,
            lng: -2.629034,
            rollSize: "md",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "South Newton-le-Willows College",
            id: "9ecfaa45-022a-41e9-bbae-4c4f6ac7d751"
          },
          {
            lat: 53.323658,
            lng: -2.982499,
            rollSize: "sm",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "St Bromborough School",
            id: "b6f938e5-1375-4580-adfe-52d518b5371c"
          },
          {
            lat: 53.448266,
            lng: -2.745186,
            rollSize: "lg",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "St St Helens Grammar",
            id: "4a020161-fbfb-46f7-b973-d992a187cb15"
          },
          {
            lat: 53.445693,
            lng: -2.628686,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "New Newton-le-Willows High",
            id: "9b526dae-662c-4bb2-aec1-0e7337caaf37"
          },
          {
            lat: 53.456834,
            lng: -2.72786,
            rollSize: "md",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "North St Helens Academy",
            id: "079d45a8-7a1b-4731-8fa6-e4734e075cb7"
          },
          {
            lat: 53.405279,
            lng: -2.839426,
            rollSize: "sm",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "South Huyton School",
            id: "6c5a6e1a-44fe-4a0d-930f-a459a2f8ea8d"
          },
          {
            lat: 53.397839,
            lng: -2.570533,
            rollSize: "md",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "West Warrington High",
            id: "9da1303a-519e-4a77-9d62-44331c37dd59"
          },
          {
            lat: 53.450194,
            lng: -2.636047,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "South Newton-le-Willows Grammar",
            id: "c45f5a6b-f7cf-466c-bfe1-9c67e2142623"
          },
          {
            lat: 53.389577,
            lng: -2.578535,
            rollSize: "sm",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "West Warrington Academy",
            id: "92c8d966-fb06-42ca-9cc7-02f536d4f6a6"
          },
          {
            lat: 53.250125,
            lng: -2.520664,
            rollSize: "md",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "South Northwich Grammar",
            id: "a60ff50b-312f-4957-ac11-69b6813a5bb1"
          },
          {
            lat: 53.443075,
            lng: -2.62558,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "St Newton-le-Willows High",
            id: "419e801c-eb3e-4bc6-8581-2f47dff78b93"
          },
          {
            lat: 53.443736,
            lng: -2.624554,
            rollSize: "md",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "East Newton-le-Willows Grammar",
            id: "cd099324-5669-40f6-b8b9-a60f3053f21d"
          },
          {
            lat: 53.384688,
            lng: -2.588512,
            rollSize: "lg",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "New Warrington High",
            id: "0b9230aa-44a7-4c02-a186-f916ce6f920e"
          },
          {
            lat: 53.29773,
            lng: -2.723163,
            rollSize: "md",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "South Frodsham College",
            id: "9bc319db-e4ee-46ea-84e8-df2c273861eb"
          },
          {
            lat: 53.395553,
            lng: -2.572346,
            rollSize: "lg",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "West Warrington High",
            id: "82f108df-9925-4cf2-834c-609164b9dbee"
          },
          {
            lat: 53.386918,
            lng: -2.585326,
            rollSize: "sm",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "East Warrington Academy",
            id: "d5f41fb9-62dc-4de8-9911-7774712de1a4"
          },
          {
            lat: 53.266805,
            lng: -2.519037,
            rollSize: "sm",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "St Northwich High",
            id: "d56c0c1b-e92e-48e6-a6b5-a2fd86bb159c"
          },
          {
            lat: 53.461268,
            lng: -2.728321,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "East St Helens Academy",
            id: "9a8967a7-dc2b-4977-a123-9f8c83cb5104"
          },
          {
            lat: 53.448953,
            lng: -2.632524,
            rollSize: "sm",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "East Newton-le-Willows Learning Centre",
            id: "c19f2a16-0fff-4602-952b-803594b44246"
          },
          {
            lat: 53.421017,
            lng: -2.838145,
            rollSize: "sm",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "New Huyton School",
            id: "724afd3f-56e9-4d05-8dca-3bb9a28342cb"
          },
          {
            lat: 53.395299,
            lng: -2.582892,
            rollSize: "md",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "New Warrington Learning Centre",
            id: "c9136c82-fe9b-4f4c-934c-87d10d03becc"
          },
          {
            lat: 53.354921,
            lng: -2.832204,
            rollSize: "sm",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "East Halewood Grammar",
            id: "2369d120-6872-4b2a-af67-b64097c9565d"
          },
          {
            lat: 53.248831,
            lng: -2.510306,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "New Northwich Grammar",
            id: "10b98bc4-f014-443c-baad-06ffb7605ca5"
          },
          {
            lat: 53.363701,
            lng: -2.822165,
            rollSize: "sm",
            balance: "positive",
            phase: "P",
            hexColor: "#F6D8E1",
            popup: "New Halewood Learning Centre",
            id: "56bfab7b-83eb-440c-a694-d8bf2219f2b6"
          },
          {
            lat: 53.288493,
            lng: -2.728131,
            rollSize: "sm",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "West Frodsham Grammar",
            id: "b6611a8e-ecb0-476c-9452-76be60696319"
          },
          {
            lat: 53.45006,
            lng: -2.620981,
            rollSize: "sm",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "West Newton-le-Willows High",
            id: "0ccf91f2-bb88-4d25-984c-ab3ab9814d39"
          },
          {
            lat: 53.314975,
            lng: -2.967189,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "North Bromborough Academy",
            id: "ec384999-7063-4dcd-bac0-6717ac190fc3"
          },
          {
            lat: 53.41006,
            lng: -2.836839,
            rollSize: "sm",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "South Huyton High",
            id: "4696208f-848a-4715-960e-4321e6d0138b"
          },
          {
            lat: 53.357533,
            lng: -2.834328,
            rollSize: "sm",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "North Halewood Learning Centre",
            id: "cdda86b2-6817-43af-be46-801058e582b9"
          },
          {
            lat: 53.36042,
            lng: -2.836674,
            rollSize: "sm",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "East Halewood Academy",
            id: "ef7b91f7-b5c7-49ef-b16d-2489585def98"
          },
          {
            lat: 53.264279,
            lng: -2.512919,
            rollSize: "lg",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "New Northwich Grammar",
            id: "48bf8bc8-5c69-41f0-a9aa-852f96aff2e0"
          },
          {
            lat: 53.312995,
            lng: -2.970803,
            rollSize: "lg",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "South Bromborough School",
            id: "d41ee1aa-531e-4554-a3bb-a7b25c1356d0"
          },
          {
            lat: 53.287695,
            lng: -2.718934,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "North Frodsham College",
            id: "760bc77e-2529-4008-9774-499f57170f24"
          },
          {
            lat: 53.421006,
            lng: -2.853423,
            rollSize: "lg",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "St Huyton High",
            id: "c814d30b-620c-4128-ace1-9d7127fc55c3"
          },
          {
            lat: 53.301387,
            lng: -2.721765,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "St Frodsham School",
            id: "b84b23c3-0ffe-406f-ab08-549461c6865c"
          },
          {
            lat: 53.457927,
            lng: -2.6294,
            rollSize: "lg",
            balance: "negative",
            phase: "SP",
            hexColor: "#B64638",
            popup: "North Newton-le-Willows Learning Centre",
            id: "9601ac69-cfe6-499a-bd41-957c47bf2723"
          },
          {
            lat: 53.311201,
            lng: -2.972919,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "St Bromborough School",
            id: "00715b1d-974e-405a-83ee-2a53a728fdce"
          },
          {
            lat: 53.356466,
            lng: -2.832417,
            rollSize: "sm",
            balance: "neutral",
            phase: "A",
            hexColor: "#698BAB",
            popup: "South Halewood Learning Centre",
            id: "e72a45aa-cf21-4260-99fa-a6f97387dae0"
          },
          {
            lat: 53.47234,
            lng: -2.248423,
            rollSize: "lg",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "North Manchester School",
            id: "74969c83-6920-4f74-8356-2205455b0c9c"
          },
          {
            lat: 53.411197,
            lng: -2.852288,
            rollSize: "md",
            balance: "negative",
            phase: "A",
            hexColor: "#B64638",
            popup: "West Huyton School",
            id: "adeea799-8568-4129-b64f-2375dc8e20be"
          },
          {
            lat: 53.482803,
            lng: -2.240394,
            rollSize: "md",
            balance: "positive",
            phase: "A",
            hexColor: "#F6D8E1",
            popup: "St Manchester Academy",
            id: "de4a3591-e102-4d2e-8dca-15ec8ed20729"
          },
          {
            lat: 53.441019,
            lng: -2.635495,
            rollSize: "sm",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "St Newton-le-Willows Learning Centre",
            id: "392d887b-6fe9-4238-92cb-b20676b28ea4"
          },
          {
            lat: 53.440964,
            lng: -2.634994,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "St Newton-le-Willows Academy",
            id: "b5729d1a-0a8a-44ea-af87-8977e105de21"
          },
          {
            lat: 53.29839,
            lng: -2.732091,
            rollSize: "lg",
            balance: "positive",
            phase: "S",
            hexColor: "#F6D8E1",
            popup: "West Frodsham College",
            id: "74124824-1f3f-41fe-bdb3-f6a37acb7a89"
          },
          {
            lat: 53.398812,
            lng: -2.577832,
            rollSize: "md",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "West Warrington Learning Centre",
            id: "663fe37d-d3b1-4af9-a2cf-1edc228fb683"
          },
          {
            lat: 53.252031,
            lng: -2.524068,
            rollSize: "sm",
            balance: "negative",
            phase: "S",
            hexColor: "#B64638",
            popup: "New Northwich Learning Centre",
            id: "e14bd1fb-80ef-4a01-b36a-7186c92e31d8"
          },
          {
            lat: 53.367078,
            lng: -2.835598,
            rollSize: "md",
            balance: "positive",
            phase: "N",
            hexColor: "#F6D8E1",
            popup: "West Halewood College",
            id: "a9e71917-6321-4952-b1e0-825fbfbac4c0"
          },
          {
            lat: 53.406104,
            lng: -2.835904,
            rollSize: "md",
            balance: "neutral",
            phase: "S",
            hexColor: "#698BAB",
            popup: "St Huyton Academy",
            id: "7f6e2d8b-ac90-46ca-87f0-0ea690826967"
          },
          {
            lat: 53.279489,
            lng: -2.901806,
            rollSize: "lg",
            balance: "neutral",
            phase: "P",
            hexColor: "#698BAB",
            popup: "North Ellesmere Port School",
            id: "52922a16-1091-4654-8c18-352fbba2eb11"
          },
          {
            lat: 53.386638,
            lng: -2.584883,
            rollSize: "md",
            balance: "negative",
            phase: "N",
            hexColor: "#B64638",
            popup: "East Warrington Learning Centre",
            id: "90369475-8457-4f6f-8577-933e5f3faa68"
          },
          {
            lat: 53.362929,
            lng: -2.820092,
            rollSize: "lg",
            balance: "neutral",
            phase: "N",
            hexColor: "#698BAB",
            popup: "South Halewood Learning Centre",
            id: "fa7b33ff-5c74-4309-91b0-eb7970a1b7a6"
          },
          {
            lat: 53.273746,
            lng: -2.889862,
            rollSize: "sm",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "North Ellesmere Port School",
            id: "7acde365-4bc6-4383-83fa-647b99b18549"
          },
          {
            lat: 53.33356,
            lng: -2.740501,
            rollSize: "md",
            balance: "negative",
            phase: "P",
            hexColor: "#B64638",
            popup: "New Runcorn Grammar",
            id: "174828e2-7876-4ea7-8e43-9dbc5940dc55"
          },
          {
            lat: 53.450625,
            lng: -2.636082,
            rollSize: "lg",
            balance: "neutral",
            phase: "SP",
            hexColor: "#698BAB",
            popup: "New Newton-le-Willows Grammar",
            id: "0d95be8a-79c3-4a5a-a983-e27cd7e5a226"
          },
          {
            lat: 53.354362,
            lng: -2.83192,
            rollSize: "lg",
            balance: "positive",
            phase: "SP",
            hexColor: "#F6D8E1",
            popup: "New Halewood College",
            id: "0e690b9f-7d3a-4524-b35c-bf0996eed6fb"
          },
          {
            lat: 53.355012,
            lng: -2.83245,
            rollSize: "md",
            balance: "unavailable",
            phase: "O",
            specialSchool: true,
            hexColor: "#61B752",
            popup: "Riverside Academy",
            id: "2f61e8d1-1c7e-4ed3-9d02-f5a835b7412f"
          },
          {
            lat: 53.353890,
            lng: -2.83075,
            rollSize: "sm",
            balance: "unavailable",
            phase: "16",
            specialSchool: true,
            hexColor: "#F6BF58",
            popup: "Brookfield Sixth Form",
            id: "7d69e5a3-0ab1-4e97-9010-f1c56b0c0a3c"
          },
          {
            lat: 53.354725,
            lng: -2.83310,
            rollSize: "lg",
            balance: "unavailable",
            phase: "O",
            specialSchool: true,
            hexColor: "#8B94B1",
            popup: "Hilltop Special School",
            id: "53e44c8d-4b1f-45c2-bc38-0ddf9a7c3a7d"
          },
          {
            lat: 53.355420,
            lng: -2.83115,
            rollSize: "md",
            balance: "unavailable",
            phase: "16",
            specialSchool: true,
            hexColor: "#B46350",
            popup: "Elmwood College",
            id: "84f1e693-4827-474f-8f15-f42fa750cdab"
          },
          {
            lat: 53.353650,
            lng: -2.83225,
            rollSize: "sm",
            balance: "unavailable",
            phase: "O",
            specialSchool: true,
            hexColor: "#F17587",
            popup: "Oakdale Learning Centre",
            id: "22bb7cf5-b55b-4c3b-95f0-594474d40946"
          },
  {
    lat: 53.4178,
    lng: -3.0852,
    rollSize: "md",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#61B752",
    popup: "Seaview Academy",
    id: "1"
  },
  {
    lat: 53.4125,
    lng: -3.1011,
    rollSize: "lg",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#F6BF58",
    popup: "Greenbank College",
    id: "2"
  },
  {
    lat: 53.4089,
    lng: -3.0884,
    rollSize: "sm",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#8B94B1",
    popup: "Brookside Learning Centre",
    id: "3"
  },
  {
    lat: 53.4152,
    lng: -3.0943,
    rollSize: "md",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#B46350",
    popup: "Westfield Sixth Form",
    id: "4"
  },
  {
    lat: 53.4096,
    lng: -3.0825,
    rollSize: "lg",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#F17587",
    popup: "Riverside School",
    id: "5"
  },
  {
    lat: 53.4190,
    lng: -3.0981,
    rollSize: "sm",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#61B752",
    popup: "Northgate College",
    id: "6"
  },
  {
    lat: 53.4138,
    lng: -3.0846,
    rollSize: "md",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#F6BF58",
    popup: "Oakwood Academy",
    id: "7"
  },
  {
    lat: 53.4165,
    lng: -3.1052,
    rollSize: "lg",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#8B94B1",
    popup: "Lakeside Sixth Form",
    id: "8"
  },
  {
    lat: 53.4074,
    lng: -3.0977,
    rollSize: "sm",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#B46350",
    popup: "Hillcrest School",
    id: "9"
  },
  {
    lat: 53.4147,
    lng: -3.0899,
    rollSize: "md",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#F17587",
    popup: "Elmhurst College",
    id: "10"
  },
  {
    lat: 53.4205,
    lng: -3.0932,
    rollSize: "lg",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#61B752",
    popup: "Parkside Academy",
    id: "11"
  },
  {
    lat: 53.4091,
    lng: -3.1057,
    rollSize: "sm",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#F6BF58",
    popup: "Maplewood Sixth Form",
    id: "12"
  },
  {
    lat: 53.4170,
    lng: -3.0803,
    rollSize: "md",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#8B94B1",
    popup: "Bayview School",
    id: "13"
  },
  {
    lat: 53.4118,
    lng: -3.0871,
    rollSize: "lg",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#B46350",
    popup: "Silverwood College",
    id: "14"
  },
  {
    lat: 53.4183,
    lng: -3.1008,
    rollSize: "sm",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#F17587",
    popup: "Cliffside Academy",
    id: "15"
  },
  {
    lat: 53.4065,
    lng: -3.0916,
    rollSize: "md",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#61B752",
    popup: "Meadowvale College",
    id: "16"
  },
  {
    lat: 53.4159,
    lng: -3.0855,
    rollSize: "lg",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#F6BF58",
    popup: "Stonebridge Academy",
    id: "17"
  },
  {
    lat: 53.4129,
    lng: -3.0962,
    rollSize: "sm",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#8B94B1",
    popup: "Redwood Sixth Form",
    id: "18"
  },
  {
    lat: 53.4196,
    lng: -3.0888,
    rollSize: "md",
    balance: "unavailable",
    phase: "O",
    specialSchool: true,
    hexColor: "#B46350",
    popup: "Kingswood Academy",
    id: "19"
  },
  {
    lat: 53.4104,
    lng: -3.0833,
    rollSize: "lg",
    balance: "unavailable",
    phase: "16",
    specialSchool: true,
    hexColor: "#F17587",
    popup: "Fairfield College",
    id: "20"
  }

      ],
};
