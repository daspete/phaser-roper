<template>
    <div class="level-editor">
        <div class="level-editor__header">
            Roper LevelEditor
            <span>0.1.0</span>
        </div>

        <div class="level-editor__content">
            <div class="level-editor__toolbox">
                <div>name <input v-model="level.name" type="text"></div>
                <div>width <input v-model="level.width" type="number"></div>
                <div>height <input v-model="level.height" type="number"></div>

                <div>
                    elements
                    <div v-for="element in level.elements" :key="`element-layer-${ element.file }-${element.id}`">{{ element.name }}</div>
                </div>
            </div>

            <div class="level-editor__minimap">
                
            </div>

            <div class="level-editor__level" ref="level-wrapper">
                <level :level="level" ref="level-container"></level>
            </div>

            <div class="level-editor__elements" ref="elements-wrapper">
                <div>
                    <div v-on:click="() => { this.currentElements = 'startend' }">Start und Endplatformen</div>
                    <div v-on:click="() => { this.currentElements = 'obstacles' }">Hindernisse</div>
                </div>
                
                <div 
                    class="element element--draggable" 
                    style="transform: scale(0.5); transform-origin: 0% 50%" 
                    v-for="(element, elementID) in elements[currentElements]" 
                    :key="`${ element.file }-${ elementID }`"
                    :data-type="element.type"
                    :data-object-type="element.objectType"
                >
                    <img :src="`/${ element.file }`" alt=""/>
                </div>
            </div>
        </div>


        <div class="level-editor__footer">
            <button class="btn--big" v-on:click="ResetLevel">Neues Level erstellen</button>
            <button class="btn--big" v-on:click="LoadLevel">Level laden</button>
            <button class="btn--big" v-on:click="SaveLevel">Level speichern</button>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import interact from 'interactjs'
import TweenMax from 'gsap'

import Level from '~/components/Level'


export default {
    props: [
        'elements'
    ],

    components: {
        draggable,
        Level
    },

    head() {
        return {
            title: "LevelEditor"
        };
    },

    data() {
        return {
            currentElements: 'obstacles',
            level: {
                name: 'New Level',
                width: 1400,
                height: 780,
                elements: []
            }
        };
    },

    mounted(){
        interact('.element--draggable').draggable({
            context: this.$refs.levelContainer,
            onmove(event){
                let target = event.target;

                let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                TweenMax.set(target, {
                    x: x,
                    y: y,
                    scale: 1
                });

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        });

        interact('.level').dropzone({
            accept: '.element--draggable',
            ondrop: (event) => {
                let target = event.relatedTarget;
                
                let elementX = parseFloat(target.getAttribute('data-x'));
                let elementY = parseFloat(target.getAttribute('data-y'));

                let elementOffset = this.GetElementPosition(target);
                let containerOffset = this.GetElementPosition(this.$refs['level-wrapper']);

                let x = elementOffset.x - containerOffset.x + elementX;
                let y = elementOffset.y - containerOffset.y + elementY;

                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);

                TweenMax.set(target, {
                    x: 0,
                    y: 0,
                    scale: 0.5
                });
                
                let type = target.getAttribute('data-type');
                let objectType = target.getAttribute('data-object-type');

                let element = this.FindObjectByType(objectType, type);
                element.id = Date.now();
                element.position.x = x;
                element.position.y = y;

                this.level.elements.push(element);
            }
        })
    },

    methods: {
        ResetLevel() {},

        LoadLevel() {},

        async SaveLevel() {
            await this.$axios.$post('levels', this.level);
        },

        FindObjectByType(objectType, type){
            let object = this.elements[objectType].find((element) => { return element.type == type });

            return JSON.parse(JSON.stringify(object));
        },

        GetElementPosition(el){
            var xPos = 0;
            var yPos = 0;
            
            while (el) {
                if (el.tagName == "BODY") {
                    var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                    var yScroll = el.scrollTop || document.documentElement.scrollTop;
                
                    xPos += (el.offsetLeft - xScroll + el.clientLeft);
                    yPos += (el.offsetTop - yScroll + el.clientTop);
                } else {
                    xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                    yPos += (el.offsetTop - el.scrollTop + el.clientTop);
                }
            
                el = el.offsetParent;
            }
            return {
                x: xPos,
                y: yPos
            };
        }

    }
};
</script>

