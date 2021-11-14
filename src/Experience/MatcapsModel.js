import * as THREE from 'three'
import { mergeUniforms } from 'three/src/renderers/shaders/UniformsUtils.js'
import Experience from './Experience.js'
import matcapVertex from './shaders/matcap/vertex.glsl'
import matcapFragment from './shaders/matcap/fragment.glsl'

export default class MatcapsModel
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.bounceColor = '#7c8627'
        
        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'matcapsModel'
            })

            this.debugFolder
                .addInput(
                    this,
                    'bounceColor',
                    { view: 'color' }
                )
                .on('change', () =>
                {
                    this.uniforms.uBounceColor.value.set(this.bounceColor)
                })
        }

        this.setUniforms()
        this.setModel()
    }

    setUniforms()
    {
        this.uniforms = {}
        this.uniforms.uBounceColor = { value: new THREE.Color(this.bounceColor) }
        this.uniforms.uBounceOrientationOffset = { value: 1 }
        this.uniforms.uBounceOrientationMultiplier = { value: 0.62 }
        this.uniforms.uBounceDistanceLimit = { value: 3.8 }
        
        // Debug
        if(this.debug)
        {
            this.debugFolder
                .addInput(
                    this.uniforms.uBounceOrientationOffset,
                    'value',
                    { label: 'uBounceOrientationOffset', min: - 1, max: 1 }
                )
                
            this.debugFolder
                .addInput(
                    this.uniforms.uBounceOrientationMultiplier,
                    'value',
                    { label: 'uBounceOrientationMultiplier', min: 0, max: 3 }
                )
                
            this.debugFolder
                .addInput(
                    this.uniforms.uBounceDistanceLimit,
                    'value',
                    { label: 'uBounceDistanceLimit', min: 0, max: 10 }
                )
        }
    }

    setModel()
    {
        this.model = {}
        this.model.resource = this.resources.items.model

        // Traverse the scene and save materials
        this.model.materials = {}
        
        this.model.resource.scene.traverse((_child) => 
        {
            if(_child instanceof THREE.Mesh && _child.material instanceof THREE.MeshStandardMaterial)
            {
                let material = this.model.materials[_child.material.name]

                if(!material)
                {
                    material = {}
                    material.original = _child.material
                    material.meshes = []

                    this.model.materials[_child.material.name] = material
                }

                material.meshes.push(_child)
            }
        })
        
        // Create new materials
        for(const _materialKey in this.model.materials)
        {
            const material = this.model.materials[_materialKey]

            const matcapTexture = this.resources.items[`${material.original.name}MatcapTexture`]
            matcapTexture.encoding = THREE.sRGBEncoding

            // material.new = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

            material.new = new THREE.ShaderMaterial({
                uniforms: mergeUniforms([
                    THREE.UniformsLib.common,
                    THREE.UniformsLib.bumpmap,
                    THREE.UniformsLib.normalmap,
                    THREE.UniformsLib.displacementmap,
                    THREE.UniformsLib.fog,
                    THREE.UniformsLib.lights,
                    {
                        matcap: { value: null }
                    }
                ]),
                defines:
                {
                    MATCAP: '',
                    USE_MATCAP: ''
                },
                vertexShader: matcapVertex,
                fragmentShader: matcapFragment
            })
            material.new.matcap = matcapTexture
            material.new.uniforms.matcap.value = matcapTexture
                
            material.new.uniforms.uBounceColor = this.uniforms.uBounceColor
            material.new.uniforms.uBounceOrientationOffset = this.uniforms.uBounceOrientationOffset
            material.new.uniforms.uBounceOrientationMultiplier = this.uniforms.uBounceOrientationMultiplier
            material.new.uniforms.uBounceDistanceLimit = this.uniforms.uBounceDistanceLimit

            for(const _mesh of material.meshes)
            {
                _mesh.material = material.new
            }
        }

        this.scene.add(this.model.resource.scene)
    }
}
