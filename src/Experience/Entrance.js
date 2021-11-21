import * as THREE from 'three'
import Experience from './Experience.js'

export default class Entrance
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
                title: 'entrance'
            })
        }

        this.setModel()
    }

    setModel()
    {
        this.model = {}
        this.model.color = '#ffffff'

        this.model.resource = this.resources.items.entranceModel

        this.model.mesh = this.model.resource.scene.children[0]
        this.model.mesh.material.transparent = true
        this.model.mesh.material.emissive.set(this.model.color)
        this.scene.add(this.model.resource.scene)

        // Debug
        if(this.debug)
        {
            this.debugFolder
                .addInput(
                    this.model,
                    'color',
                    { view: 'color' }
                )
                .on('change', () =>
                {
                    this.model.mesh.material.emissive.set(this.model.color)
                })
        }
    }
}
