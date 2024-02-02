import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";

class ThreeApp {
  constructor() {
    this.init();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setupControls();
    this.loadEnvironment();
    this.loadModel();
    this.setupEvents();
    this.animate();
  }

  init() {
    this.clock = new THREE.Clock();
    this.loadingManager = new THREE.LoadingManager();
    this.progressBar = document.getElementById("progress-bar");
    this.progressBarContainer = document.querySelector(
      ".progress-bar-container"
    );
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.camera.position.set(5, 8, 30);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }

  setupControls() {
    this.controls = new FirstPersonControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.movementSpeed = 8;
    this.controls.lookSpeed = 0.08;
  }

  loadEnvironment() {
    this.rgbeLoader = new RGBELoader(this.loadingManager);

    this.rgbeLoader.load(
      "./assets/MR_INT-006_LoftIndustrialWindow_Griffintown.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
      }
    );

    this.loadingManager.onProgress = (url, loaded, total) => {
      this.progressBar.value = (loaded / total) * 100;
    };

    this.loadingManager.onLoad = () => {
      this.progressBarContainer.style.display = "none";
    };
  }

  loadModel() {
    const loader = new GLTFLoader(this.loadingManager);

    loader.load(
      "./assets/mars_one_mission_-_base/scene.gltf",
      (gltf) => {
        this.scene.add(gltf.scene);
        gltf.animations;
        gltf.scene;
        gltf.scenes;
        gltf.cameras;
        gltf.assets;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened");
      }
    );
  }

  setupEvents() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    this.controls.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate the ThreeApp class to start the application
const app = new ThreeApp();
