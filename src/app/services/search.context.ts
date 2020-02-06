import {Injectable, Type} from '@angular/core';
import {CameraContext} from './camera.context';
import {SceneContext} from './scene.context';
import {LightContext} from './light.context';
import {SlotTransformNode} from '../slots/transform-node.slot';
import {isDecalSlot} from '../interfaces/decal.interface';
import {isActivatable} from '../interfaces/activatable.interface';

@Injectable({providedIn: 'root'})
export class SearchContext {
    activeSlot: SlotTransformNode;
    showAR = false;

    constructor(
        private readonly camera: CameraContext,
        private readonly scene: SceneContext,
        private readonly light: LightContext,
    ) {
    }

    clear(all = true) {
        if (this.activeSlot && isActivatable(this.activeSlot)) {
            this.activeSlot.activate(false);
            if (isDecalSlot(this.activeSlot)) {
                this.activeSlot.removeDecal();
            }
            this.activeSlot = undefined;
        }
        if (all) {
            this.camera.hideMiniMap();
            this.camera.resetMainCamera();
        }
        this.light.updatePlayerLight(this.camera.mainCamera.position, true);
        this.showAR = false;
    }

    findSlot<T extends SlotTransformNode>(term: string, searchedType: Type<T>): T {
        this.clear(false);
        /*
        * Find the object that represents our desired object.
        * Get all Nodes / Objects from the scene and filter them by some properties.
        * 1. Type of Node we are looking for
        * 2. Is it activatable at all ?
        * 3. Does it store information ?
        * Inspect each filtered node for the information, and store the found slot for later.
        */
        this.activeSlot = this.scene.scene.transformNodes
            .filter(node => node instanceof searchedType && isActivatable(node))
            .find((node: T) => node.information === term) as T;

        /*
        * check if the Node has custom functionality that could be enabled
        * Is it possible to add a decal to the Node ?
        */
        if (isDecalSlot(this.activeSlot)) {
            this.activeSlot.addDecal(this.activeSlot);
        }
        return this.activeSlot as T;
    }

    goto() {
        if (this.activeSlot) {
            this.camera.moveCameraAndLookAt(this.activeSlot.getAbsolutePosition());
            this.light.updatePlayerLight(this.camera.mainCamera.position, true);
            this.showAR = true;
        }
    }
}
