require('dotenv').config();

module.exports = {
    head: {
        titleTemplate: 'Phaser Roper - %s',
        htmlAttrs: {
            lang: 'de'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },

    css: [
        '~/assets/scss/styles.scss'
    ],

    build: {
        extractCSS: true
    },


    plugins: [
        { src: '~/plugins/phaser', ssr: false }
    ],

    modules: [
        '@nuxtjs/axios'
    ]
}