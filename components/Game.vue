<template>
    <div>
        <div id="game-container"></div>
    </div>
</template>

<script>

import settings from '~/game/Settings'

export default {

    props: [
        'levels'
    ],

    

    data(){
        return {
            game: null
        }
    },

    mounted(){
        settings.levels = this.levels;
        this.game = new Game(settings);
    },

    methods: {

    }

}
</script>

