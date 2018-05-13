<template>
    <level-editor :elements="elements"></level-editor>
</template>

<script>
import LevelEditor from '~/components/LevelEditor'

export default {
    components: {
        LevelEditor
    },

    async asyncData({ app }){
        let obstacles = await app.$axios.$get('obstacles');
        let startend = await app.$axios.$get('startend');

        return {
            elements: {
                obstacles: obstacles,
                startend: startend
            }
        }
    }
}
</script>

