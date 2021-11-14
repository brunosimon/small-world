import * as THREE from 'three'
import Experience from './Experience.js'

import floorBackgroundVertex from './shaders/floorBackground/vertex.glsl'
import floorBackgroundFragment from './shaders/floorBackground/fragment.glsl'

import floorBakedVertex from './shaders/floorBaked/vertex.glsl'
import floorBakedFragment from './shaders/floorBaked/fragment.glsl'

export default class Floor
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'floor'
            })
        }

        this.setBackground()
        this.setBaked()
    }

    setBackground()
    {
        this.background = {}

        // Colors
        this.background.colors = {}

        this.background.colors.topLeft = {}
        this.background.colors.topLeft.value = '#85902B'
        this.background.colors.topLeft.instance = new THREE.Color(this.background.colors.topLeft.value)

        this.background.colors.topRight = {}
        this.background.colors.topRight.value = '#7C8627'
        this.background.colors.topRight.instance = new THREE.Color(this.background.colors.topRight.value)

        this.background.colors.bottomLeft = {}
        this.background.colors.bottomLeft.value = '#C6CD60'
        this.background.colors.bottomLeft.instance = new THREE.Color(this.background.colors.bottomLeft.value)

        this.background.colors.bottomRight = {}
        this.background.colors.bottomRight.value = '#9FA73F'
        this.background.colors.bottomRight.instance = new THREE.Color(this.background.colors.bottomRight.value)

        // Geometry
        this.background.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        
        // Material
        this.background.material = new THREE.ShaderMaterial({
            vertexColors: true,
            depthWrite: false,
            vertexShader: floorBackgroundVertex,
            fragmentShader: floorBackgroundFragment
        })

        // Mesh
        this.background.mesh = new THREE.Mesh(this.background.geometry, this.background.material)
        this.background.mesh.frustumCulled = false
        this.scene.add(this.background.mesh)

        // Update colors
        this.background.updateColors = () =>
        {
            this.background.colors.topLeft.instance.set(this.background.colors.topLeft.value)
            this.background.colors.topRight.instance.set(this.background.colors.topRight.value)
            this.background.colors.bottomLeft.instance.set(this.background.colors.bottomLeft.value)
            this.background.colors.bottomRight.instance.set(this.background.colors.bottomRight.value)
            
            const colors = new Float32Array(4 * 3)
            
            colors[0] = this.background.colors.topLeft.instance.r
            colors[1] = this.background.colors.topLeft.instance.g
            colors[2] = this.background.colors.topLeft.instance.b
            
            colors[3] = this.background.colors.topRight.instance.r
            colors[4] = this.background.colors.topRight.instance.g
            colors[5] = this.background.colors.topRight.instance.b
            
            colors[6] = this.background.colors.bottomLeft.instance.r
            colors[7] = this.background.colors.bottomLeft.instance.g
            colors[8] = this.background.colors.bottomLeft.instance.b
            
            colors[9] = this.background.colors.bottomRight.instance.r
            colors[10] = this.background.colors.bottomRight.instance.g
            colors[11] = this.background.colors.bottomRight.instance.b

            this.background.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        }
        this.background.updateColors()

        // Debug
        if(this.debug)
        {
            for(const _colorName in this.background.colors)
            {
                const color = this.background.colors[_colorName]

                this.debugFolder
                    .addInput(
                        color,
                        'value',
                        {
                            label: `${_colorName}Color`, view: 'color'
                        }
                    )
                    .on('change', this.background.updateColors)
            }
        }
    }

    setBaked()
    {
        this.baked = {}

        this.baked.color = '#4c5219'

        this.baked.texture = this.resources.items.bakedFloorTexture
        this.baked.texture.flipY = false

        this.baked.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlphaMask: { value: this.baked.texture },
                uColor: { value: new THREE.Color(this.baked.color) }
            },
            vertexShader: floorBakedVertex,
            fragmentShader: floorBakedFragment
        })

        this.baked.model = this.resources.items.bakedFloorModel.scene.children[0]
        this.baked.model.material = this.baked.material
        this.scene.add(this.baked.model)
        
        // Debug
        if(this.debug)
        {
            this.debugFolder
                .addInput(
                    this.baked,
                    'color',
                    { label: 'shadowColor', view: 'color' }
                )
                .on('change', () =>
                {
                    this.baked.material.uniforms.uColor.value.set(this.baked.color)
                })
        }
    }
}
