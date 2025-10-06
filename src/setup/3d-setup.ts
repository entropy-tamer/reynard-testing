/**
 * 3D Test Setup - For packages that need Three.js and 3D graphics APIs
 */

import { vi } from "vitest";
import { setupBrowserTest } from "./browser-setup.js";

/**
 * Setup for 3D packages (reynard-3d, etc.)
 * Includes Three.js, OrbitControls, and 3D graphics mocks
 */
export function setup3DTest() {
  setupBrowserTest();

  // Mock Three.js
  (global as any).THREE = {
    // Core classes
    Scene: class MockScene {
      add = vi.fn();
      remove = vi.fn();
      clear = vi.fn();
      traverse = vi.fn();
      getObjectByName = vi.fn();
      getObjectById = vi.fn();
      getObjectByProperty = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    PerspectiveCamera: class MockCamera {
      constructor() {}
      updateProjectionMatrix = vi.fn();
      lookAt = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    WebGLRenderer: class MockRenderer {
      constructor() {}
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      setClearColor = vi.fn();
      setClearAlpha = vi.fn();
      setPixelRatio = vi.fn();
      setAnimationLoop = vi.fn();
      getSize = vi.fn(() => ({ width: 800, height: 600 }));
      getPixelRatio = vi.fn(() => 1);
      getContext = vi.fn();
      getInfo = vi.fn(() => ({ memory: { geometries: 0, textures: 0 } }));
    },

    // Lights
    AmbientLight: class MockAmbientLight {
      constructor() {}
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    DirectionalLight: class MockDirectionalLight {
      constructor() {}
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    PointLight: class MockPointLight {
      constructor() {}
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    // Colors and vectors
    Color: class MockColor {
      constructor() {}
      set = vi.fn();
      setHex = vi.fn();
      setRGB = vi.fn();
      setHSL = vi.fn();
      clone = vi.fn();
      copy = vi.fn();
    },

    Vector3: class MockVector3 {
      constructor() {}
      set = vi.fn();
      add = vi.fn();
      sub = vi.fn();
      multiply = vi.fn();
      divide = vi.fn();
      length = vi.fn(() => 1);
      normalize = vi.fn();
      clone = vi.fn();
      copy = vi.fn();
    },

    Vector2: class MockVector2 {
      constructor() {}
      set = vi.fn();
      add = vi.fn();
      sub = vi.fn();
      multiply = vi.fn();
      divide = vi.fn();
      length = vi.fn(() => 1);
      normalize = vi.fn();
      clone = vi.fn();
      copy = vi.fn();
    },

    // Math utilities
    Clock: class MockClock {
      constructor() {}
      getElapsedTime = vi.fn(() => 0);
      getDelta = vi.fn(() => 0.016);
    },

    Matrix4: class MockMatrix4 {
      constructor() {}
      set = vi.fn();
      multiply = vi.fn();
      multiplyMatrices = vi.fn();
      clone = vi.fn();
      copy = vi.fn();
      makeRotationX = vi.fn();
      makeRotationY = vi.fn();
      makeRotationZ = vi.fn();
      makeTranslation = vi.fn();
      makeScale = vi.fn();
    },

    // Geometries
    BufferGeometry: class MockBufferGeometry {
      constructor() {}
      setAttribute = vi.fn();
      getAttribute = vi.fn();
      deleteAttribute = vi.fn();
      addGroup = vi.fn();
      clearGroups = vi.fn();
      computeBoundingBox = vi.fn();
      computeBoundingSphere = vi.fn();
      dispose = vi.fn();
    },

    Float32BufferAttribute: class MockFloat32BufferAttribute {
      constructor() {}
      set = vi.fn();
      getX = vi.fn();
      getY = vi.fn();
      getZ = vi.fn();
      setX = vi.fn();
      setY = vi.fn();
      setZ = vi.fn();
    },

    InstancedBufferGeometry: class MockInstancedBufferGeometry {
      constructor() {}
      setAttribute = vi.fn();
      getAttribute = vi.fn();
      deleteAttribute = vi.fn();
      dispose = vi.fn();
    },

    InstancedBufferAttribute: class MockInstancedBufferAttribute {
      constructor() {}
      set = vi.fn();
      getX = vi.fn();
      getY = vi.fn();
      getZ = vi.fn();
      setX = vi.fn();
      setY = vi.fn();
      setZ = vi.fn();
    },

    // Objects
    Object3D: class MockObject3D {
      constructor() {}
      add = vi.fn();
      remove = vi.fn();
      clear = vi.fn();
      traverse = vi.fn();
      getObjectByName = vi.fn();
      getObjectById = vi.fn();
      getObjectByProperty = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
      updateMatrix = vi.fn();
      updateMatrixWorld = vi.fn();
    },

    Group: class MockGroup {
      constructor() {}
      add = vi.fn();
      remove = vi.fn();
      clear = vi.fn();
      traverse = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    Mesh: class MockMesh {
      constructor() {}
      add = vi.fn();
      remove = vi.fn();
      clear = vi.fn();
      traverse = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
      updateMatrix = vi.fn();
      updateMatrixWorld = vi.fn();
    },

    Points: class MockPoints {
      constructor() {}
      add = vi.fn();
      remove = vi.fn();
      clear = vi.fn();
      traverse = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
      updateMatrix = vi.fn();
      updateMatrixWorld = vi.fn();
    },

    Line: class MockLine {
      constructor() {}
      add = vi.fn();
      remove = vi.fn();
      clear = vi.fn();
      traverse = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
      updateMatrix = vi.fn();
      updateMatrixWorld = vi.fn();
    },

    // Materials
    PointsMaterial: class MockPointsMaterial {
      constructor() {}
      clone = vi.fn();
      copy = vi.fn();
      dispose = vi.fn();
    },

    MeshBasicMaterial: class MockMeshBasicMaterial {
      constructor() {}
      clone = vi.fn();
      copy = vi.fn();
      dispose = vi.fn();
    },

    MeshStandardMaterial: class MockMeshStandardMaterial {
      constructor() {}
      clone = vi.fn();
      copy = vi.fn();
      dispose = vi.fn();
    },

    LineBasicMaterial: class MockLineBasicMaterial {
      constructor() {}
      clone = vi.fn();
      copy = vi.fn();
      dispose = vi.fn();
    },

    // Geometries
    SphereGeometry: class MockSphereGeometry {
      constructor() {}
      dispose = vi.fn();
    },

    BoxGeometry: class MockBoxGeometry {
      constructor() {}
      dispose = vi.fn();
    },

    CylinderGeometry: class MockCylinderGeometry {
      constructor() {}
      dispose = vi.fn();
    },

    // Textures
    TextureLoader: class MockTextureLoader {
      constructor() {}
      load = vi.fn(() => Promise.resolve({}));
    },

    CanvasTexture: class MockCanvasTexture {
      constructor() {}
      dispose = vi.fn();
    },

    // Sprites
    Sprite: class MockSprite {
      constructor() {}
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
      updateMatrix = vi.fn();
      updateMatrixWorld = vi.fn();
    },

    SpriteMaterial: class MockSpriteMaterial {
      constructor() {}
      clone = vi.fn();
      copy = vi.fn();
      dispose = vi.fn();
    },

    // Helpers
    AxesHelper: class MockAxesHelper {
      constructor() {}
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    GridHelper: class MockGridHelper {
      constructor() {}
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    },

    // Math utilities
    Frustum: class MockFrustum {
      constructor() {}
      setFromProjectionMatrix = vi.fn();
      intersectsObject = vi.fn(() => true);
      intersectsSphere = vi.fn(() => true);
      intersectsBox = vi.fn(() => true);
    },

    Sphere: class MockSphere {
      constructor() {}
      set = vi.fn();
      setFromPoints = vi.fn();
      clone = vi.fn();
      copy = vi.fn();
    },

    Box3: class MockBox3 {
      constructor() {}
      set = vi.fn();
      setFromObject = vi.fn();
      setFromPoints = vi.fn();
      clone = vi.fn();
      copy = vi.fn();
    },

    Raycaster: class MockRaycaster {
      constructor() {}
      set = vi.fn();
      setFromCamera = vi.fn();
      intersectObject = vi.fn(() => []);
      intersectObjects = vi.fn(() => []);
    },

    // Constants
    PCFSoftShadowMap: 1,
    ACESFilmicToneMapping: 1,
    SRGBColorSpace: 1,
  };

  // Mock OrbitControls
  (global as any).OrbitControls = class MockOrbitControls {
    constructor() {}
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    dispose = vi.fn();
    update = vi.fn();
    set enabled(_value: boolean) {}
    get enabled() {
      return true;
    }
    set enableDamping(_value: boolean) {}
    set dampingFactor(_value: number) {}
    set enableZoom(_value: boolean) {}
    set enablePan(_value: boolean) {}
    set enableRotate(_value: boolean) {}
    set minDistance(_value: number) {}
    set maxDistance(_value: number) {}
    set maxPolarAngle(_value: number) {}
    set autoRotate(_value: boolean) {}
    set autoRotateSpeed(_value: number) {}
    set zoomSpeed(_value: number) {}
    set rotateSpeed(_value: number) {}
    set panSpeed(_value: number) {}
    set target(_value: any) {}
    get target() {
      return { x: 0, y: 0, z: 0 };
    }
  };
}
