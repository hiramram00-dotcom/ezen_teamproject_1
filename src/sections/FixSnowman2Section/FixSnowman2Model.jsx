import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import snowmanModel from '../../../3d/snowman.glb?url'
import studioEnvironment from '../../../3d/studio-light.hdr.hdr?url'

function FixSnowman2Model({
  className = '',
  glassColor = '#f0f0f0',
  bodyColor = '#9f9f9f',
  lampColor = '#ffd7a6',
  cameraZ = 14,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    const clock = new THREE.Clock()
    const environmentGenerator = new THREE.PMREMGenerator(renderer)
    let model = null
    let frame = null
    let environmentMap = null
    let isVisible = false
    const glassMaterials = []
    const glowMaterials = []
    const baseGlassColor = new THREE.Color(glassColor)
    const litGlassColor = new THREE.Color(lampColor)
    const baseLampColor = new THREE.Color(lampColor)

    renderer.setClearColor(0xffffff, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.82
    environmentGenerator.compileEquirectangularShader()

    camera.position.set(0, 0.15, cameraZ)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 1.15))

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
    keyLight.position.set(-4, 4, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xd7dce0, 0.85)
    fillLight.position.set(5, 1, 2)
    scene.add(fillLight)

    const lampLight = new THREE.PointLight(baseLampColor, 0, 4.8, 2)
    lampLight.position.set(0, 0.75, 0.8)
    scene.add(lampLight)

    new RGBELoader().load(studioEnvironment, (texture) => {
      environmentMap = environmentGenerator.fromEquirectangular(texture).texture
      scene.environment = environmentMap
      texture.dispose()
      environmentGenerator.dispose()
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(rect.width, 1)
      const height = Math.max(rect.height, 1)

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const loader = new GLTFLoader()
    loader.load(snowmanModel, (gltf) => {
      model = gltf.scene

      const bounds = new THREE.Box3().setFromObject(model)
      const center = bounds.getCenter(new THREE.Vector3())
      const size = bounds.getSize(new THREE.Vector3())
      const maxSize = Math.max(size.x, size.y, size.z)

      model.position.sub(center)
      model.scale.setScalar(4.2 / maxSize)
      model.rotation.y = -0.16
      model.traverse((object) => {
        if (!object.isMesh) return

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]

        materials.forEach((material) => {
          if (!material) return

          if (material.emissive && material.emissive.getHex() !== 0) {
            material.emissive.set(0xffd4a0)
            material.emissiveIntensity = 0
            glowMaterials.push(material)
            material.needsUpdate = true
            return
          }

          if (material.metalness > 0.5) {
            material.color.set(bodyColor)
            material.roughness = 0.42
            material.metalness = 1
            material.envMapIntensity = 1.05
            material.clearcoat = 0.05
            material.clearcoatRoughness = 0.5
            material.needsUpdate = true
            return
          }

          if (material.transmission <= 0) return

          material.color.copy(baseGlassColor)
          material.opacity = 1
          material.transparent = false
          material.transmission = 0
          material.roughness = 0.1
          material.metalness = 0
          material.envMapIntensity = 1.5
          material.clearcoat = 1
          material.clearcoatRoughness = 0.06
          material.depthWrite = true
          material.emissive.copy(baseLampColor)
          material.emissiveIntensity = 0
          glassMaterials.push(material)
          material.needsUpdate = true
        })
      })
      scene.add(model)
    })

    const render = () => {
      frame = null
      if (!isVisible) return

      if (model) {
        const elapsed = clock.getElapsedTime()
        const turn = Number.parseFloat(canvas.parentElement.dataset.turn) || 0
        const enter = Number.parseFloat(canvas.parentElement.dataset.enter) || 0
        const light = Number.parseFloat(canvas.parentElement.dataset.light) || 0
        const final = Number.parseFloat(canvas.parentElement.dataset.final) || 0
        const showcase = canvas.parentElement.dataset.showcase === '1'
        const showcaseSpin = showcase ? final * elapsed * 0.16 : 0

        model.rotation.y =
          -0.16 + turn + showcaseSpin + Math.sin(elapsed * 0.45) * 0.04
        // 사이드 롤 스윕 등장: 처음에 좌측으로 36도, 뒤로 30도 비스듬히 누웠다가 오뚝이처럼 굴러서 정면으로 일어남
        // enter는 0(시작)에서 1(다 올라옴)로 변함
        model.rotation.x = (1 - enter) * (-Math.PI / 6)
        model.rotation.z = (1 - enter) * (Math.PI / 5)
        lampLight.intensity = light * (showcase ? 10.5 : 5.5)
        glassMaterials.forEach((material) => {
          material.color
            .copy(baseGlassColor)
            .lerp(litGlassColor, light * (showcase ? 0.62 : 0.42))
          material.emissiveIntensity = light * (showcase ? 0.72 : 0.35)
        })
        glowMaterials.forEach((material) => {
          material.emissiveIntensity = light * (showcase ? 6.2 : 3.8)
        })
      }

      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting

        if (isVisible && frame === null) {
          resize()
          frame = requestAnimationFrame(render)
        } else if (!isVisible && frame !== null) {
          cancelAnimationFrame(frame)
          frame = null
        }
      },
      { threshold: 0 },
    )

    resize()
    visibilityObserver.observe(canvas)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      visibilityObserver.disconnect()
      if (frame) cancelAnimationFrame(frame)
      scene.traverse((object) => {
        if (!object.isMesh) return
        object.geometry?.dispose()

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]
        materials.forEach((material) => material?.dispose())
      })
      environmentMap?.dispose()
      environmentGenerator.dispose()
      renderer.dispose()
    }
  }, [bodyColor, cameraZ, glassColor, lampColor])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

export default FixSnowman2Model
