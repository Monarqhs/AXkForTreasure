import * as thr from './Three JS/build/three.module.js'
import {OrbitControls} from './Three JS/examples/jsm/controls/OrbitControls.js'

// Three Element
const scene = new thr.Scene()
const camera = new thr.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new thr.WebGLRenderer()

// Orbit Camera
const orbitCamera = new thr.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
const control = new OrbitControls(orbitCamera, renderer.domElement)

let currentCamera = camera

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// CreateObject
function createPlane(w, h, x, y, z){
    const geo = new thr.PlaneGeometry(w, h)
    const material = new thr.MeshBasicMaterial({side: thr.DoubleSide})
    const mesh = new thr.Mesh(geo, material)
    return mesh
}

// Object
const ground = createPlane(100, 100, 0, 0, 0)
ground.rotation.set(-Math.PI / 2)
ground.receiveShadow = true
scene.add(ground)

// Lighting
const pointLight = new thr.PointLight('#FF0000', 2, 200)
pointLight.position.set(0, 13, 0)
pointLight.castShadow = true

function createSpotlight14(x, y, z){
    const spotLight = new thr.SpotLight('#FFFFFF', 0.6, 50)
    spotLight.position.set(x, y, z)
    
    return spotLight
}
const sL1 = createSpotlight14(13, 2, 13)
const sL2 = createSpotlight14(13, 2, -13)
const sL3 = createSpotlight14(-13, 2, 13)
const sL4 = createSpotlight14(-13, 2, -13)
scene.add(sL1, sL2, sL3, sL4)

function createSpotlight56(x, y, z){
    const spotLight = new thr.SpotLight('#FF0000', 0.8, 50)
    spotLight.position.set(x, y, z)

    return spotLight
}
const sL5 = createSpotlight56(50, 0, 0)
const sL6 = createSpotlight56(-50, 0, 0)
scene.add(sL5, sL6)

// Camera Frame
orbitCamera.position.set(0, 20, 70)

camera.position.set(0, 20,70)
camera.lookAt(0, 0, 0)

// render
function render(){
    renderer.render(scene, currentCamera)
    control.update()
    requestAnimationFrame(render)
}

window.onload = () => render()

