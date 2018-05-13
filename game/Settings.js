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

    rope: {
        maxLength: 750,
        distanceX: 4,
        mass: 0.6,
        sectionDivisor: 10,
        bungeeFactor: 1, // 0.5
        maxDistance: 180, // 120
        upForce: 0.009,
    }
}   