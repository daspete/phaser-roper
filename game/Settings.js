export default {
    debug: false,
    fps: true,
    player: {
        mass: 3,
        gravityScale: 1,
        shootTimer: 40,
        jumpForce: {
            x: 300,
            y: 300
        }
    },
    wire: {
        color: 'rgb(255,0,0)',
        width: 2,
        maxLength: 750,
        mass: 0.5,  // 0.7
        bungeeFactor: 0.2, // 0.5
        //sectionDivisor: 40, // 40,
        segments: 6,// 6
        maxDistance: 240, // 120,
        distanceX: 5,
        upForce: 0.009
    },

    rope: {
        maxLength: 750,
        distanceX: 4,
        mass: 0.4,
        sectionDivisor: 10,
        bungeeFactor: 1, // 0.5
        maxDistance: 300, // 120
        upForce: 0.0092,
    }
}   