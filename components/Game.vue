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
            <div class="game__description">
                Press Space to swing forward and get to the end platform without loosing grip :) you can create new levels in the <a href="/leveleditor">Leveleditor</a><br>
                This game isn't optimized quite well at the moment, so be sure you play it in the Chrome browser.
            </div>



            <div class="game__main-menu" v-if="showStartMenu">
                <button class="game__main-menu__start-button" v-on:click="StartGame"><span>START GAME</span></button>
            </div>
            <div class="game__main-menu" v-if="showRestartMenu">
                <button class="game__main-menu__restart-button" v-on:click="StartGame"><span>RESTART GAME</span></button>
            </div>



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
            level: null,
            state: null,
            showStartMenu: false,
            showRestartMenu: false
        }
    },

    mounted(){
        settings.levels = this.levels;
        this.game = new Game(settings, this);
    },

    methods: {
        InitGameFromMainMenu(state){
            this.showStartMenu = true;
            this.state = state;
        },

        OnMainMenuStateUpdate(){
            if(this.state.spacebar.isDown){
                this.StartGame();
            }
        },

        OnGameStateUpdate(){

        },

        StartGame(){
            this.showStartMenu = false;
            this.state.StartGame();
        },

        SetScore(points){
            this.score = points;
        },

        AddScore(points){
            this.score += points;
        },
        SetLevel(level){
            this.level = level;
        }
    }

}
</script>

