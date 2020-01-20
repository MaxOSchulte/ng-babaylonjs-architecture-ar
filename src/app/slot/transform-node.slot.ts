import {TransformNode, Vector3} from '@babylonjs/core';
import {SceneContext} from '../services/scene.context';
import {SlotFactory} from '../services/slot.factory';

export abstract class SlotTransformNode extends TransformNode {
    dimensions: Dimensions;
    protected slotType: SlotType;

    constructor(readonly sceneContext: SceneContext,
                readonly slotFactory: SlotFactory,
                parent?: TransformNode) {
        super('SlotTransformNode-' + Math.random(), sceneContext.scene);
        this.parent = parent;
    }

    abstract init(dimensions: Dimensions, name: string, type: SlotType);
}


export enum SlotType {
    Box,
    Stack,
    Column,
    Random,
    Ground,
    Bulb,
}

export interface Dimensions {
    height: number;
    width: number;
    depth?: number;
    position?: Vector3;
    parentDimensions?: Dimensions;
}
