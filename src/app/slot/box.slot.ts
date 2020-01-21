import {Injectable} from '@angular/core';
import {ActionManager, ExecuteCodeAction, Mesh, MeshBuilder} from '@babylonjs/core';
import {LightService} from '../services/light.service';
import {MaterialService} from '../services/material.service';
import {SceneContext} from '../services/scene.context';
import {SlotFactory} from '../services/slot.factory';
import {Dimensions, SlotTransformNode, SlotType} from './transform-node.slot';
import {SearchContext} from '../services/search.context';
import {DecalSlot, decalSlotBehavior, removeDecalSlotBehavior} from '../interfaces/decal.interface';
import {ContainerSlot, fillSlotBehavior} from '../interfaces/fill-slot.interface';
import {Lightable, Pickable} from '../interfaces/misc.interface';


@Injectable()
export class BoxSlot extends SlotTransformNode implements DecalSlot, Lightable, ContainerSlot, Pickable {

    decal: Mesh;
    readonly meshes: Mesh[] = [];

    fillSlot = fillSlotBehavior;
    addDecal = decalSlotBehavior;
    removeDecal = () => removeDecalSlotBehavior(this);


    constructor(
        sceneContext: SceneContext,
        slotFactory: SlotFactory,
        public readonly lightService: LightService,
        public readonly materialService: MaterialService,
        parent: SlotTransformNode,
    ) {
        super(sceneContext, slotFactory);
        this.parent = parent;
    }

    init(dimensions: Dimensions, name: string, type: SlotType) {
        this.dimensions = dimensions;
        this.name = name;
        this.slotType = type;
        this.position = this.dimensions.position;
        this.fillSlot(this);
    }

    addLight() {
        const light = MeshBuilder.CreateBox(this.name + 'Light1', { ...this.dimensions, height: .2, width: .2 });
        light.position.y = this.dimensions.height / 2 - 0.5;
        light.position.x = this.dimensions.width / 2 + 0.5;
        light.material = this.materialService.getBoxLightMaterial();
        light.parent = this;

        const light2 = light.clone(this.name + 'light2');
        light2.position.x = light.position.x * -1;
    }

    enablePick(pickable: boolean) {
        this.meshes[0].isPickable = pickable;
    }
}
