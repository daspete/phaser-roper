<template>
    <game :levels="levels"></game>
</template>

<script>
import Game from '~/components/Game'

export default {
    components: {
        Game
    },

    head(){
        return {
            title: 'Game'
        }
    },

    async asyncData({ app }){
        let levels = await app.$axios.$get('levels');

        return {
            levels: levels
        }
    }
}
</script>
