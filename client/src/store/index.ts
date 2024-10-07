import {proxy} from 'valtio'

const state = proxy({
  intro: false,
  preview: false,
  color: "#EFBD4E",
  isLogoTexture: true,
  isFullTexture: false,
  isLeftShoulderLogo: false,
  isRightShoulderLogo: false,
  isBackLogo: false,
  logoDecal: "./threejs.png",
  leftShoulderDecal: "./threejs.png",
  rightShoulderDecal: "./threejs.png",
  backDecal: "./threejs.png",
  fullDecal: "./threejs.png",
  mode: "prod",
});

export default state