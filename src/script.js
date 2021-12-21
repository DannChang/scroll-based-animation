import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const textureLoader = new THREE.TextureLoader(); // Usually loaded on the very top of the code
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})
// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

// Create an Object variable to preselect distance
const objectDistance =  -4;

mesh1.position.y = objectDistance * 0;
mesh1.scale.set(0.5, 0.5, 0.5)
mesh2.position.y = objectDistance * 1;
mesh2.scale.set(0.5, 0.5, 0.5)
mesh3.position.y = objectDistance * 2;
mesh3.scale.set(0.5, 0.5, 0.5)

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;


scene.add(mesh1, mesh2, mesh3)

// Array of our meshes to animate all at once
const sectionMeshes = [ mesh1, mesh2, mesh3 ]





/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('#FFFFFF', 1);
directionalLight.position.set(1,1,0);

scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll 
 */
let scrollY = window.scrollY; // To be accessed by object camera in tick()

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    // console.log(scrollY);
})

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}


window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width;
    cursor.y = event.clientY / sizes.height;

    console.log(cursor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // ANimate camera
    camera.position.y = scrollY / sizes.height * objectDistance;

    // Move cursor according to parrallax
    const parallaxX = cursor.x;
    const parallaxY = cursor.y;
    camera.position.x =  parallaxX;
    camera.position.y = - parallaxY;


    // Animate meshes
    sectionMeshes.forEach(mesh => {
        mesh.rotation.x = elapsedTime * 0.1;
        mesh.rotation.y = elapsedTime * 0.52;
    })

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()