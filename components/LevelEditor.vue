<template>
    <div class="level-editor">
        <div class="level-editor__header">
            Roper LevelEditor
            <span>0.1.0</span>
        </div>

        <div class="level-editor__content">
            <div class="level-editor__toolbox">
                <div class="header">Level Settings</div>
                <div>Name <input v-model="level.name" type="text"></div>
                <div>Width <input v-model="level.width" type="number"></div>
                <div>Height <input v-model="level.height" type="number"></div>

                <div>
                    <div class="header">Elements</div>
                    <div class="element" v-for="(element, elementID) in level.elements" :key="`element-layer-${ element.file }-${element.id}`">
                        <button class="btn--icon" v-on:click="DeleteElement(elementID)">x</button> {{ element.name }} 
                    </div>
                </div>
            </div>

            <div class="level-editor__minimap">
                <div :style="levelPreviewStyles">
                    <level :level="level" :preview="true"></level>
                </div>
            </div>

            <div class="level-editor__level" ref="level-wrapper">
                <level :level="level" ref="level-container"></level>
            </div>

            <div class="level-editor__elements" ref="elements-wrapper">
                <div>
                    <button class="btn--selector" v-on:click="() => { this.currentElements = 'startend' }">Start and Goal</button>
                    <button class="btn--selector" v-on:click="() => { this.currentElements = 'obstacles' }">Obstacles</button>
                </div>
                
                <div 
                    class="element element--draggable"
                    style="width: 50%; padding: 1rem; display: inline-block"
                    v-for="(element, elementID) in elements[currentElements]" 
                    :key="`${ element.file }-${ elementID }`"
                    :data-type="element.type"
                    :data-object-type="element.objectType"
                    :title="element.name"
                >
                    <div :style="`width: 100%; height: 50px; background-size: contain; background-position: center center; background-repeat: no-repeat; background-image: url('${ element.file }')`"></div>
                </div>
            </div>
        </div>


        <div class="level-editor__footer">
            <button class="btn--big" v-on:click="ResetLevel">New</button>
            <button class="btn--big" v-on:click="LoadLevel">Load</button>
            <button class="btn--big" v-on:click="SaveLevel">Save</button>
        </div>

        <div class="level-editor__level-selector" v-if="showLevelSelector">
            <div class="level-editor__level-selector__underlay"></div>
            <div class="level-editor__level-selector__content">
                <div v-for="currentLevel in levels" class="level-selector" v-on:click="OnLevelSelected(currentLevel)" :key="`level-selector-${ currentLevel.id }`">
                    <div class="level-name">
                        {{ currentLevel.name }}
                    </div>
                    <div class="level-preview">
                        <div :style="levelPreviewStyles">
                            <level :level="currentLevel" :preview="true"></level>
                        </div>
                    </div>
                </div>
            </div>
            <div class="level-editor__level-selector__footer">
                <button class="btn--big" v-on:click="() => { this.showLevelSelector = false; }">Cancel</button>
            </div>
           
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
        let defaultLevel = {
            name: 'New Level',
            width: 3000,
            height: 1200,
            elements: []
        };
        return {
            currentElements: 'obstacles',
            levels: [],
            showLevelSelector: false,
            defaultLevel: defaultLevel,
            level: JSON.parse(JSON.stringify(defaultLevel))
        };
    },

    computed: {
        levelPreviewStyles(){
            let widthRatio = 200 / this.level.width;
            let heightRatio = 150 / this.level.height;

            let ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            return {
                transform: 'scale(' + ratio + ')',
                transformOrigin: '0% 0%'
            }
        }
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
                    y: y
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
                    y: 0
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
        ResetLevel() {
            this.level = JSON.parse(JSON.stringify(this.defaultLevel));
        },

        async LoadLevel() {
            this.levels = await this.$axios.$get('levels');

            this.showLevelSelector = true;
        },

        OnLevelSelected(level){
            this.level = level;

            this.showLevelSelector = false;
        },

        async SaveLevel() {
            let hasStart = this.level.elements.find((element) => {
                return element.start == true;
            });

            if(!hasStart){
                alert('There is no start element, please set one');
                return;
            }

            let hasEnd = this.level.elements.find((element) => {
                return element.start == false;
            });

            if(!hasEnd){
                alert('There is no end element, please set one');
                return;
            }

            let level = null;

            if(this.level.id){
                level = await this.$axios.$put(`levels/${ this.level.id }`, this.level);
            }else{
                level = await this.$axios.$post('levels', this.level);
            }

            this.level.id = level.id;
            
        },

        DeleteElement(elementID){
            this.level.elements.splice(elementID, 1);
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

