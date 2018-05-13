<template>
    <div class="obstacle" :data-id="obstacle.id">
        <img :src="`/${ obstacle.file }`">
    </div>
</template>

<script>
import interact from 'interactjs';
import TweenMax from 'gsap';

export default {
    props: ['obstacle', 'levelContainer', 'preview'],

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
            TweenMax.set(`.obstacle[data-id="${ this.obstacle.id }"]`, {
                x: this.obstacle.position.x,
                y: this.obstacle.position.y
            });

            if(this.preview == true) return;
            
            this.interact = interact(`.obstacle[data-id="${ this.obstacle.id }"]`)
                .draggable({
                    context: this.levelContainer,

                    onmove: (event) => {
                        this.obstacle.position.x += event.dx;
                        this.obstacle.position.y += event.dy;

                        TweenMax.set(event.target, {
                            x: this.obstacle.position.x,
                            y: this.obstacle.position.y
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

