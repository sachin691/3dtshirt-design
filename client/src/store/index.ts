import {proxy} from 'valtio'

const state = proxy({
    intro : true,
    color : '#EFBD4E',
    isLogoTexture : true,
    isFullTexture : false,
    isLeftShoulderLogo: false,
    isRightShoulderLogo: false,
    isBackLogo: false,
    logoDecal : './threejs.png',
    fullDecal : './threejs.png',
    mode : "prod"
})

export default state