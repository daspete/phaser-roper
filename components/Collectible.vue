<template>
    <div class="collectible" :data-id="collectible.id">
        <img :src="`/${ collectible.file }`">
    </div>
</template>

<script>
import interact from 'interactjs';
import TweenMax from 'gsap';

export default {
    props: ['collectible', 'levelContainer', 'preview'],

    data(){
        return {
            interact: null
        }
    },

    mounted(){
        this.Init();
        this.Update();
    },

    methods: {

        Init(){
            TweenMax.set(`.collectible[data-id="${ this.collectible.id }"]`, {
                x: this.collectible.position.x,
                y: this.collectible.position.y
            });

            if(this.preview == true) return;
            
            this.interact = interact(`.collectible[data-id="${ this.collectible.id }"]`)
                .draggable({
                    context: this.levelContainer,

                    onmove: (event) => {
                        this.collectible.position.x += event.dx;
                        this.collectible.position.y += event.dy;

                        TweenMax.set(event.target, {
                            x: this.collectible.position.x,
                            y: this.collectible.position.y
                        });
                    },

                    onend: () => {
                        this.$parent.$parent.Update();
                    }
                })
        },

        Update(){

        }

    }

}
</script>

