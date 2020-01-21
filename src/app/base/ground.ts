import { Injectable } from '@angular/core';
import { MeshBuilder, Mesh, Vector3 } from '@babylonjs/core';
import { MaterialService } from '../services/material.service';
import { SceneContext } from '../services/scene.context';
import { SlotFactory } from '../services/slot.factory';
import {
    Dimensions,
    SlotTransformNode,
    SlotType
} from '../slot/transform-node.slot';
import { SCALE } from '../constants';
import {DecalSlot, removeDecalSlotBehavior} from '../interfaces/decal.interface';

@Injectable({
    providedIn: 'root'
})
export class Ground extends SlotTransformNode implements DecalSlot {
    decal: Mesh;
    mesh: Mesh;

    constructor(
        scene: SceneContext,
        factory: SlotFactory,
        private readonly materialService: MaterialService
    ) {
        super(scene, factory);
    }

    init(dimensions: Dimensions, name: string, type: SlotType) {
        this.mesh = MeshBuilder.CreateGround(
            'ground',
            { width: dimensions.width, height: dimensions.height },
            this.sceneContext.scene
        );
        this.mesh.receiveShadows = true;
        this.mesh.material = this.materialService.getGroundMaterial();
        this.addDecal();
    }

    removeDecal = () => removeDecalSlotBehavior(this);

    addDecal() {
        if (!this.decal) {
            this.decal = Mesh.CreateDecal(
                this.name + 'decal',
                this.mesh,
                this.mesh
                    .getAbsolutePosition()
                    .add(Vector3.Backward().scale(3 * SCALE)),
                new Vector3(0, 1, 0),
                new Vector3(10, 10, 10),
                0
            );
            this.decal.rotate(new Vector3(0, 0, 1), -1.57);
            this.decal.material = this.materialService.getGroundDecal();
            this.decal.parent = this;
        }
    }
}
