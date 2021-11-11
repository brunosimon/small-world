import * as THREE from 'three'
import Experience from './Experience.js'
import Floor from './Floor.js'
import MatcapsModel from './MatcapsModel.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setFloor()
                this.setMatcapsModel()
            }
        })
    }

    setFloor()
    {
        this.floor = new Floor()
    }

    setMatcapsModel()
    {
        this.matcapsModel = new MatcapsModel()
    }

    resize()
    {
    }

    update()
    {
    }

    destroy()
    {
    }
}