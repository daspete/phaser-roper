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
        settings.level = this.levels[0];
        this.game = new Game(settings);
    },

    methods: {

    }

}
</script>

