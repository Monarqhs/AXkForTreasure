import * as thr from './Three JS/build/three.module.js'
import {OrbitControls} from './Three JS/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "./Three JS/examples/jsm/loaders/GLTFLoader.js"

// Three Element
var raycast = new thr.Raycaster();
var pointer = new thr.Vector2();
const scene = new thr.Scene()
const camera = new thr.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new thr.WebGLRenderer({antialias: true})

// Texture Loader
const textureLoader = new thr.TextureLoader()

// Orbit Camera
const orbitCamera = new thr.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const control = new OrbitControls(orbitCamera, renderer.domElement)

let currentCamera = camera

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// Switch Camera
window.addEventListener("keydown", (e) => {
    if (e.key === "f") {
        currentCamera = currentCamera === camera ? orbitCamera : camera;
        control.object = currentCamera;
    
        if (currentCamera === orbitCamera) {
          orbitCamera.position.set(0, 20, 70);
          control.enabled = true;
        } else {
          camera.position.set(0, 20, 70);
          control.enabled = false;
        }
    }
    console.log(currentCamera)
  })

// CreateObject
function createPlane(w, h){
    const geo = new thr.PlaneGeometry(w, h)
    const texture = textureLoader.load("./assets/sand.jpg") 
    const material = new thr.MeshPhongMaterial({map: texture, side: thr.DoubleSide})
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
    const material = new thr.MeshPhongMaterial({color: '#FFFF00'})
    const mesh = new thr.Mesh(geo, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(0, 13, 0)
    
    return mesh
}

let Text

function createText(text){
    const fontLoader = new thr.FontLoader()

    fontLoader.load("./Three JS/examples/fonts/helvetiker_bold.typeface.json", 
        font => {
            const textGeo = new thr.TextGeometry(text, {
                font: font,
                size: 2,
                height: 2
            })
            const textMat = new thr.MeshPhongMaterial({
                color: "#FFFFFF"
            })
            Text = new thr.Mesh(textGeo, textMat)
            Text.castShadow = true
            Text.receiveShadow = true
            Text.position.set(-10, 18, 0)

            scene.add(Text)
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
ground.position.set(0, 0, 0)
ground.rotation.set(-Math.PI/2, 0, 0);
ground.receiveShadow = true
scene.add(ground)

const pillar1 = createCylinder(15, 15, 15)
const pillar2 = createCylinder(-15, 15, 15)
const pillar3 = createCylinder(15, 15, -15)
const pillar4 = createCylinder(-15, 15, -15)
scene.add(pillar1, pillar2, pillar3, pillar4)

const sky = createSkyBox()
scene.add(sky)

const text = createText("Don't Click Me!")
scene.add(text)

let treasure = createSphere()
scene.add(treasure)

function pillarFall() {
    requestAnimationFrame(pillarFall);
    if (
      pillar1.position.y > 3 &&
      pillar1.rotation.x < Math.PI / 2 &&
      pillar1.position.z < 40
    ) {
      pillar1.position.y -= 0.2;
      pillar1.rotation.x += 0.03;
      pillar1.position.z += 0.3;
    }

    if (
      pillar2.position.y > 3 &&
      pillar2.rotation.x < Math.PI / 2 &&
      pillar2.position.z < 40
    ) {
      pillar2.position.y -= 0.2;
      pillar2.rotation.x += 0.03;
      pillar2.position.z += 0.3;
    }
}

// Altar
let load3DModel = url => {
    let loader = new GLTFLoader();
    loader.load(url, (gltf) => {
        gltf.scene.position.set(0, 5, 0);
        gltf.scene.rotation.set(-Math.PI / 2, -Math.PI / 2, -Math.PI / 2);
        let object = gltf.scene;
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object)
    })
}

load3DModel("./assets/altar_for_diana/scene.gltf")

// Lighting
const pointLight = new thr.PointLight('#FF0000', 2, 200)
pointLight.position.set(0, 13, 0)
pointLight.castShadow = true
scene.add(pointLight)

function createSpotlight14(x, y, z){
    const spotLight = new thr.SpotLight('#FFFFFF', 0.6, 60)
    spotLight.position.set(x, y, z)
    spotLight.castShadow = true
    
    return spotLight
}
const sL1 = createSpotlight14(13, 2, 13)
const sL2 = createSpotlight14(13, 2, -13)
const sL3 = createSpotlight14(-13, 2, 13)
const sL4 = createSpotlight14(-13, 2, -13)
scene.add(sL1, sL2, sL3, sL4)

function createSpotlight56(x, y, z, a, b, c){
    const spotLight = new thr.SpotLight('#FF0000', 0.8, 50)
    spotLight.position.set(x, y, z)
    spotLight.target.position.set(a, b, c);

    return spotLight
}
const sL5 = createSpotlight56(6, 13, 0, 50, 0, 0)
const sL6 = createSpotlight56(-6, 13, 0, -50, 0, 0)
// scene.add(sL5, sL6)

function finalScene() {
    requestAnimationFrame(finalScene);
    if (treasure.position.y >= 0) {
        treasure.position.y -= 0.01;
    }
    sL1.color.set('#FF0000');
    sL2.color.set('#FF0000');
    sL3.color.set('#FF0000');
    sL4.color.set('#FF0000');
    scene.add(sL5);
    scene.add(sL6);
    pillarFall();
}

function onMouseDown(event) {
    // console.log("Mouse down event detected!");
    // console.log("Mouse coordinates:", event.clientX, event.clientY);
    console.log("clickText", text);
    console.log("sphere", treasure);

    event.preventDefault();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycast.setFromCamera(pointer, camera);
    const intersects = raycast.intersectObjects([Text, treasure]);
    if (intersects.length > 0) {
      console.log("text clicked!");
      finalScene();
    }
}
  
document.addEventListener("click", onMouseDown, false);

// Camera Frame
// orbitCamera.position.set(0, 20, 70)

camera.position.set(0, 20, 70)
camera.lookAt(0, 0, 0)

// render
function render(){
    requestAnimationFrame(render)
    control.update()
    renderer.render(scene, currentCamera)
}

window.onload = () => render()

window.onresize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    renderer.setSize(width, height);
    const aspect = width / height;
  };