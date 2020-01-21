import {BoxBuilder} from '@babylonjs/core';
import {SlotTransformNode} from '../slot/transform-node.slot';
import {BoxSlot} from '../slot/box.slot';

export interface ContainerSlot {
    fillSlot(meshes: SlotTransformNode);
}

export function fillSlotBehavior(parent: BoxSlot) {
    if (parent.meshes.length) {
        parent.meshes.forEach(m => m.dispose());
        parent.meshes.length = 0;
    }

    const box = BoxBuilder.CreateBox(parent.name + 'Mesh', {...parent.dimensions}, parent.sceneContext.scene);
    box.parent = this;
    box.material = parent.materialService.getBoxMaterial(Math.random() > .5);
    parent.lightService.addShadowCaster(box);
    parent.meshes.push(box);
}
