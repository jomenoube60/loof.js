export const PHY_SCALE = 10

export const LEVELS = [{
    'background': 'level0.jpg',
    // limits starts on top left corder, clockwise
    'limits': [950, 525, 2950, 525, 2950, 1650, 950, 1650],
    'goals': [
        [1020, 1000, 1070, 1175], // goal area on left side
        [2817, 1000, 2872, 1175], // goal area on right side
    ],
    'obstacles': [
        [950, 930, 1021, 1240],
        [950, 930, 1076, 992],
        [1015, 1175, 1075, 1240],
        [2872, 930, 2955, 1240],
        [2817, 938, 2900, 992],
        [2817, 1175, 2900, 1240],
    ],
    'starting_points': [
        [1250, 1100],
        [2600, 1100]
    ]
}]

export function pixels2coords(x, y) {
    return {x: x/PHY_SCALE, y: -y/PHY_SCALE}
}
