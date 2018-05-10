export default {
    debug: true,
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
        segments: 4,// 6
        maxDistance: 240, // 120,
        distanceX: 5
    }
}   