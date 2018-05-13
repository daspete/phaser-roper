<template>
    <div class="startend" :data-id="startend.id">
        <img :src="`/${ startend.file }`">
    </div>
</template>

<script>
import interact from 'interactjs';
import TweenMax from 'gsap';

export default {
    props: ['startend', 'levelContainer'],

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
            TweenMax.set(`.startend[data-id="${ this.startend.id }"]`, {
                x: this.startend.position.x,
                y: this.startend.position.y
            });
            
            this.interact = interact(`.startend[data-id="${ this.startend.id }"]`)
                .draggable({
                    context: this.levelContainer,

                    onmove: (event) => {
                        this.startend.position.x += event.dx;
                        this.startend.position.y += event.dy;

                        TweenMax.set(event.target, {
                            x: this.startend.position.x,
                            y: this.startend.position.y
                        });
                    }
                })
        },

        Update(){

        }

    }

}
</script>

