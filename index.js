import * as thr from './Three JS/build/three.module.js'
import {OrbitControls} from './Three JS/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "./Three JS/examples/jsm/loaders/GLTFLoader.js"

// Three Element
const scene = new thr.Scene()
const camera = new thr.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
const renderer = new thr.WebGLRenderer({antialias: true})

// Texture Loader
const textureLoader = new thr.TextureLoader()

// Orbit Camera
const orbitCamera = new thr.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
const control = new OrbitControls(orbitCamera, renderer.domElement)

let currentCamera = camera

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// CreateObject
function createPlane(w, h){
    const geo = new thr.PlaneGeometry(w, h)
    const texture = textureLoader.load("./assets/sand.jpg") 
    const material = new thr.MeshBasicMaterial({map: texture, side: thr.DoubleSide})
    const mesh = new thr.Mesh(geo, material)
    return mesh
}

function createCylinder(x, y, z){
    const geo = new thr.CylinderGeometry(3, 3, 30)
    const texture = textureLoader.load("./assets/pillar.jpg") 
    const material = new thr.MeshPhongMaterial({map: texture})
    const mesh = new thr.Mesh(geo, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(x, y, z)
    
    return mesh
}

function createSphere(){
    const geo = new thr.SphereGeometry(2, 32, 16)
    // const texture = textureLoader.load("./assets/pillar.jpg") 
    const material = new thr.MeshPhongMaterial({color: '#FFFF00'})
    const mesh = new thr.Mesh(geo, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(0, 8, 0)
    
    return mesh
}

function createText(text){
    const fontLoader = new thr.FontLoader()

    fontLoader.load("./Three JS/examples/fonts/helvetiker_bold.typeface.json", 
        font => {
            const textGeo = new thr.TextGeometry(text, {
                font: font,
                size: 10,
                height: 3
            })
            const textMat = new thr.MeshBasicMaterial({
                color: "#FF0000"
            })
            mesh = new thr.Mesh(textGeo, textMat)

            mesh.position.set(-10, 18, 0)
            scene.add(mesh)
            // camera.lookAt(mesh.position)
    })
}

function createSkyBox(){
    const boxGeo = new thr.BoxGeometry(1000, 1000, 1000)
    const textureLoader = new thr.TextureLoader()
    //kanan kiri atas bawah depan belakang
    const boxMatArr = [
        new thr.MeshBasicMaterial({
            map: textureLoader.load("./assets/skybox/right.png"),
            side: thr.DoubleSide,
        }),
        new thr.MeshBasicMaterial({
            map: textureLoader.load("./assets/skybox/left.png"),
            side: thr.DoubleSide,
        }),
        new thr.MeshBasicMaterial({
            map: textureLoader.load("./assets/skybox/top.png"),
            side: thr.DoubleSide,
        }),
        new thr.MeshBasicMaterial({
            map: textureLoader.load("./assets/skybox/bottom.png"),
            side: thr.DoubleSide,
        }),
        new thr.MeshBasicMaterial({
            map: textureLoader.load("./assets/skybox/front.png"),
            side: thr.DoubleSide,
        }),
        new thr.MeshBasicMaterial({
            map: textureLoader.load("./assets/skybox/back.png"),
            side: thr.DoubleSide,
        }),
    ] 
    const skybox = new thr.Mesh(boxGeo, boxMatArr)
    return skybox
}

// Object
const ground = createPlane(100, 100)
ground.position.set(0, -6, 0)
ground.rotation.set(-Math.PI/2, 0, 0);
ground.receiveShadow = true
scene.add(ground)

const pillar1 = createCylinder(15, 15, 15)
const pillar2 = createCylinder(-15, 15, 15)
const pillar3 = createCylinder(-15, 15, -15)
const pillar4 = createCylinder(15, 15, -15)
scene.add(pillar1, pillar2, pillar3, pillar4)

const sky = createSkyBox()
scene.add(sky)

const text = createText("Don't Click Me!")
scene.add(text)

const treasure = createSphere()
scene.add(treasure)

// Altar
let load3DModel = url => {
    let loader = new GLTFLoader();
    loader.load(url, (gltf) => {
        let object = gltf.scene;
        scene.add(object)
    })
}

load3DModel("./assets/altar_for_diana/scene.gltf")

// Lighting
const pointLight = new thr.PointLight('#FF0000', 2, 200)
pointLight.position.set(0, 13, 0)
pointLight.castShadow = true

function createSpotlight14(x, y, z){
    const spotLight = new thr.SpotLight('#FFFFFF', 0.6, 50)
    spotLight.position.set(x, y, z)
    spotLight.castShadow = true
    
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
// scene.add(sL5, sL6)

// Camera Frame
orbitCamera.position.set(0, 20, 70)

camera.position.set(0, 20, 70)
camera.lookAt(0, 0, 0)

// render
function render(){
    renderer.render(scene, currentCamera)
    control.update()
    requestAnimationFrame(render)
}

window.onload = () => render()

