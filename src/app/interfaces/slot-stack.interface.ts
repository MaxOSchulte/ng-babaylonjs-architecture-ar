import {Vector3} from '@babylonjs/core';
import {BoxSlot} from '../slot/box.slot';
import {Dimensions, SlotType} from '../slot/transform-node.slot';
import {SlotFactory} from '../services/slot.factory';
import {ContainerSlot} from '../slot/container.slot';

export interface SlotContainerStack {
    dimensions: Dimensions;
    slotFactory: SlotFactory;
    name: string;

    createStack();
}

export function slotContainerStackBehavior(parent: ContainerSlot) {
    const stackDim = {
        ...parent.dimensions,
        height: parent.dimensions.height / 2 - 0.35,
        position: new Vector3(0, -parent.dimensions.height / 2 / 2, 0),
    };
    parent.slotFactory.create(BoxSlot, stackDim, parent.name + 'stack', SlotType.Box, parent);

    parent.slotFactory.create(BoxSlot, {
        ...parent.dimensions,
        height: parent.dimensions.height / 2,
        position: new Vector3(0, +parent.dimensions.height / 2 / 2, 0),
    }, parent.name + 'stack', SlotType.Box, parent).addLight();
}
