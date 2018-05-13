<template>
    <div class="level" ref="level" :style="`width: ${ level.width }px; height: ${ level.height }px`">
        
        <div 
            class="level__element" style="position: absolute"
            v-for="element in level.elements" 
            :data-id="element.id"
            :key="`level-element-${ element.file }-${ element.id }`"
        >
            <obstacle v-if="element.objectType == 'obstacles'" :preview="preview" :obstacle="element" :levelContainer="$refs.level"></obstacle>
            <start-end v-if="element.objectType == 'startend'" :preview="preview" :startend="element" :levelContainer="$refs.level"></start-end>
            <collectible v-if="element.objectType == 'collectibles'" :preview="preview" :collectible="element" :levelContainer="$refs.level"></collectible>
        </div>

    </div>
</template>

<script>
import Obstacle from '~/components/Obstacle'
import StartEnd from '~/components/StartEnd'
import Collectible from '~/components/Collectible'

export default {
    props: ['level', 'preview'],

    components: {
        Obstacle,
        StartEnd,
        Collectible
    },

    mounted(){

    }
}
</script>

