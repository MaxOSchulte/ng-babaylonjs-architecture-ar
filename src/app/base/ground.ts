import {Injectable} from '@angular/core';
import {MeshBuilder} from '@babylonjs/core';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene.context';
import {SlotFactory} from '../services/slot.factory';
import {Dimensions, SlotTransformNode, SlotType} from '../slot/transform-node.slot';

@Injectable({
    providedIn: 'root',
})
export class Ground extends SlotTransformNode {

    constructor(scene: SceneContext, factory: SlotFactory, private readonly materialService: MaterialService) {
        super(scene, factory);
    }

    init(dimensions: Dimensions, name: string, type: SlotType) {
        const ground = MeshBuilder.CreateGround('ground',
            { width: dimensions.width, height: dimensions.height }, this.sceneContext.scene);
        ground.receiveShadows = true;
        ground.material = this.materialService.getGroundMaterial();
    }
}
