<template>
    <div>
        <label :for="id" class="mb-1 size--14">{{labelTitle}}:</label>
        <input :id="id" :placeholder="placeholder" class="d-block zeta text-input p-1"/>
    </div>
</template>

<script>
    export default {
        name: 'Input',
        props: {
            id: {
                type: String
            },
            placeholder: {
                type: String
            },
            labelTitle: {
                type: String
            }
        }
    }
</script>
