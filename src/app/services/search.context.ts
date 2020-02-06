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
        private readonly light: LightContext
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
        const slots = this.scene.scene.transformNodes.filter(node => node instanceof searchedType) as T[];
        // just for the demo
        const foundIdx = Math.floor(Math.random() * slots.length);
        this.activeSlot = slots[foundIdx];

        if (isActivatable(this.activeSlot)) {
            this.activeSlot.activate(true);
        }
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
