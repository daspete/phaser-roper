<template>
    <div class="game">
        <div class="game__header">
            Roper
            <span>0.1.0</span>
        </div>
        <div class="game__stats">
            <div class="level-name" v-if="level">
                {{ level.name }}
            </div>
            <div class="score">
                {{ score }}
            </div>
        </div>

        <div class="game__wrapper">
            <div id="game-container"></div>
        </div>
        
        
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
            game: null,
            score: 0,
            level: null

        }
    },

    mounted(){
        settings.levels = this.levels;
        this.game = new Game(settings, this);
    },

    methods: {
        AddScore(points){
            this.score += points;
        },
        SetLevel(level){
            this.level = level;
        }
    }

}
</script>

