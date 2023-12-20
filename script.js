console.log("connected");
import * as THR from "./Three JS/build/three.module.js";
import { OrbitControls } from "./Three JS/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./Three JS/examples/jsm/loaders/GLTFLoader.js";

let scene, sceneCamera, orbitCamera, renderer, control, currentCamera;
const textureLoader = new THR.TextureLoader();
const gltfLoader = new GLTFLoader();
const fontLoader = new THR.FontLoader();
var raycast = new THR.Raycaster();
var pointer = new THR.Vector2();

// Scene
scene = new THR.Scene();

// Renderer
let width = window.innerWidth;
let height = window.innerHeight;
renderer = new THR.WebGLRenderer({
  antialias: true,
});

// Camera 1
let fov = 45;
let aspect = window.innerWidth / window.innerHeight;
let near = 0.1;
let far = 1000;
sceneCamera = new THR.PerspectiveCamera(fov, aspect, near, far);
const cameraPosition = new THR.Vector3(0, 20, 70);
sceneCamera.position.copy(cameraPosition);
sceneCamera.lookAt(0, 0, 0);

// Camera 2
orbitCamera = new THR.PerspectiveCamera(fov, aspect, near, far);
control = new OrbitControls(orbitCamera, renderer.domElement);
// orbitCamera.position.copy(cameraPosition)
// orbitCamera.lookAt(0, 0, 0)

currentCamera = sceneCamera;

// Switch Camera
window.addEventListener("keydown", (e) => {
  // console.log(e)
  switch (e.key) {
    case "f":
      currentCamera = currentCamera === sceneCamera ? orbitCamera : sceneCamera;
      control.object = currentCamera;

      // sceneCamera.position.set(0, 20, 70);

      break;
  }
  console.log(currentCamera);
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THR.PCFShadowMap;
renderer.setSize(width, height);
renderer.clear();
document.body.appendChild(renderer.domElement);
// renderer.domElement.addEventListener('mousedown', onMouseDown);

function pointLight() {
  const pointLight = new THR.PointLight(0xff0000, 2, 200);
  pointLight.position.set(0, 13, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);
}

function createSpotlight(color, intensity, distance) {
  const spotlight = new THR.SpotLight(color, intensity, distance);
  spotlight.castShadow = true;
  return spotlight;
}

const spotlight1 = createSpotlight(0xffffff, 0.6, 60);
spotlight1.position.set(13, 2, 13);
scene.add(spotlight1);

const spotlight2 = createSpotlight(0xffffff, 0.6, 60);
spotlight2.position.set(13, 2, -13);
scene.add(spotlight2);

const spotlight3 = createSpotlight(0xffffff, 0.6, 60);
spotlight3.position.set(-13, 2, 13)
scene.add(spotlight3);

const spotlight4 = createSpotlight(0xffffff, 0.6, 60);
spotlight4.position.set(-13, 2, -13);
scene.add(spotlight4);

const spotlight5 = createSpotlight(0xff0000, 0.8, 50);
spotlight5.position.set(6, 13, 0);
spotlight5.target.position.set(50, 0, 0);
// scene.add(spotlight5)

const spotlight6 = createSpotlight(0xff0000, 0.8, 50);
spotlight6.position.set(-6, 13, 0);
spotlight6.target.position.set(-50, 0, 0);
// scene.add(spotlight6)

function ground() {
  const groundGeo = new THR.PlaneGeometry(100, 100);
  const texture = textureLoader.load("./assets/sand.jpg");
  const groundMat = new THR.MeshPhongMaterial({
    map: texture,
    side: THR.DoubleSide,
  });
  const ground = new THR.Mesh(groundGeo, groundMat);
  ground.position.set(0, 0, 0);
  ground.rotation.set(-Math.PI / 2, 0, 0);
  ground.receiveShadow = true;
  scene.add(ground);
}

function altar() {
  console.log("./assets/altar_for_diana/texture/scene.gltf");
  gltfLoader.load("./assets/altar_for_diana/scene.gltf", function (gltf) {
    gltf.scene.position.set(0, 5, 0);
    gltf.scene.rotation.set(-Math.PI / 2, -Math.PI / 2, -Math.PI / 2);
    const altar = gltf.scene;

    altar.castShadow = true;
    altar.receiveShadow = true;

    scene.add(altar);
  });
}

let clickText;

function text() {
  fontLoader.load(
    "./Three JS/examples/fonts/helvetiker_bold.typeface.json",
    (font) => {
      const textGeo = new THR.TextGeometry("Don't Click Me!", {
        font: font,
        size: 2,
        height: 2,
      });
      const textMat = new THR.MeshPhongMaterial({
        color: 0xffffff,
      });
      clickText = new THR.Mesh(textGeo, textMat);
      clickText.position.set(-10, 18, 0);
      clickText.castShadow = true;
      clickText.receiveShadow = true;

      scene.add(clickText);
    }
  );
}

let sphere;

function treasure() {
  const sphereGeo = new THR.SphereGeometry(2, 32, 16);
  const sphereMat = new THR.MeshPhongMaterial({
    color: 0xffff00,
  });
  sphere = new THR.Mesh(sphereGeo, sphereMat);
  sphere.position.set(0, 13, 0);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);
}

function createPillar(radiusTop, radiusBottom, height) {
  const pillarGeo = new THR.CylinderGeometry(radiusTop, radiusBottom, height);
  const texture = textureLoader.load("./assets/pillar.jpg");
  const pillarMat = new THR.MeshPhongMaterial({
    map: texture,
  });
  const pillar = new THR.Mesh(pillarGeo, pillarMat);
  pillar.castShadow = true;
  pillar.receiveShadow = true;
  return pillar;
}

const pillar1 = createPillar(3, 3, 30);
pillar1.position.set(15, 15, 15);
scene.add(pillar1);

const pillar2 = createPillar(3, 3, 30);
pillar2.position.set(-15, 15, 15);
scene.add(pillar2);

const pillar3 = createPillar(3, 3, 30);
pillar3.position.set(15, 15, -15);
scene.add(pillar3);

const pillar4 = createPillar(3, 3, 30);
pillar4.position.set(-15, 15, -15);
scene.add(pillar4);

function skybox() {
  const skyboxGeo = new THR.BoxGeometry(
    window.innerWidth,
    window.innerHeight,
    1000
  );

  const skyboxMat = [
    new THR.MeshBasicMaterial({
      map: textureLoader.load("assets/skybox/right.png"),
      side: THR.DoubleSide,
    }),
    new THR.MeshBasicMaterial({
      map: textureLoader.load("assets/skybox/left.png"),
      side: THR.DoubleSide,
    }),
    new THR.MeshBasicMaterial({
      map: textureLoader.load("assets/skybox/top.png"),
      side: THR.DoubleSide,
    }),
    new THR.MeshBasicMaterial({
      map: textureLoader.load("assets/skybox/bottom.png"),
      side: THR.DoubleSide,
    }),
    new THR.MeshBasicMaterial({
      map: textureLoader.load("assets/skybox/front.png"),
      side: THR.DoubleSide,
    }),
    new THR.MeshBasicMaterial({
      map: textureLoader.load("assets/skybox/back.png"),
      side: THR.DoubleSide,
    }),
  ];

  const skybox = new THR.Mesh(skyboxGeo, skyboxMat);

  scene.add(skybox);
}

function pillarFallAnimation() {
  requestAnimationFrame(pillarFallAnimation);
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

function finalScene() {
  requestAnimationFrame(finalScene);
  if (sphere.position.y >= 0) {
    sphere.position.y -= 0.01;
  }
  spotlight1.color.set(0xff0000);
  spotlight2.color.set(0xff0000);
  spotlight3.color.set(0xff0000);
  spotlight4.color.set(0xff0000);
  scene.add(spotlight5);
  scene.add(spotlight6);
  pillarFallAnimation();
}

function onMouseDown(event) {
  // console.log("Mouse down event detected!");
  // console.log("Mouse coordinates:", event.clientX, event.clientY);
  event.preventDefault();
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycast.setFromCamera(pointer, sceneCamera);
  const intersects = raycast.intersectObjects([clickText, sphere]);
  if (intersects.length > 0) {
    console.log("text clicked!");
    finalScene();
  }
}

document.addEventListener("click", onMouseDown, false);

function render() {
  requestAnimationFrame(render);
  control.update();
  renderer.render(scene, sceneCamera);
}

window.onload = () => {
  pointLight();
  ground();
  altar();
  text();
  treasure();
  skybox();
  render();
};

window.onresize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  const aspect = width / height;
};
