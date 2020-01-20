import {Injectable} from '@angular/core';
import {TransformNode, Vector3} from '@babylonjs/core';
import {BoxSlot} from './box.slot';
import {Dimensions, SlotTransformNode, SlotType} from './transform-node.slot';
import {SlotFactory} from '../services/slot.factory';


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

@Injectable()
export class ContainerSlot extends SlotTransformNode implements SlotContainerStack {

    init(dimensions: Dimensions, name: string, slotType: SlotType) {
        this.dimensions = dimensions;
        this.position = this.dimensions.position;
        this.name = name;
        this.slotType = slotType;

        if (this.slotType === SlotType.Random) {
            const typeNum = Math.floor(Math.random() * 2);
            switch (typeNum) {
                case 0:
                    this.slotType = SlotType.Box;
                    break;
                case 1:
                    this.slotType = SlotType.Stack;
                    break;
            }
        }

        switch (this.slotType) {
            case SlotType.Box:
                this.slotFactory.create(
                    BoxSlot,
                    { ...this.dimensions, position: Vector3.Zero() },
                    this.name + 'Box', SlotType.Box, this,
                ).addLight();
                break;
            case SlotType.Stack:
                this.createStack();
                break;
        }
    }

    createStack() {
        return slotContainerStackBehavior(this);
    }
}
