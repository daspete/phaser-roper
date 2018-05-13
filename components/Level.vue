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
        </div>

    </div>
</template>

<script>
import Obstacle from '~/components/Obstacle'
import StartEnd from '~/components/StartEnd'

export default {
    props: ['level', 'preview'],

    components: {
        Obstacle,
        StartEnd
    },

    mounted(){

    }
}
</script>

