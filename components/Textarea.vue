<template>
    <div>
        <label :for="id" class="mb-1 size--14">{{labelTitle}}:</label>
        <textarea class="mt-2 w-100" :id="id" cols="10" rows="5"></textarea>
    </div>
</template>

<script>
    export default {
        name: 'Textarea',
        props: {
            id: {
                type: String
            },
            labelTitle: {
                type: String
            }
        }
    }
</script>
