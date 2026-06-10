<template>
    <span class="text-no-wrap">
        {{ date ? $dayjs(date).format(format) : '--:--' }}
    </span>
</template>

<script>
export default {
    name: "Date",
    props:{
        date: String,
        format: {
            type: String,
            default: 'DD.MM.YYYY HH:mm'
        },
    }
}
</script>
