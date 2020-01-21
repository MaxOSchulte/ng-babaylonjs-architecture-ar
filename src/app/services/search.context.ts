import {Injectable, Type} from '@angular/core';
import {CameraService} from './camera.service';
import {SceneContext} from './scene.context';
import {LightService} from './light.service';
import {Color4} from '@babylonjs/core';
import {SlotTransformNode} from '../slot/transform-node.slot';
import {isDecalSlot} from '../interfaces/decal.interface';

@Injectable({providedIn: 'root'})
export class SearchContext {


    activeSlot: SlotTransformNode;

    constructor(private readonly camera: CameraService, private readonly scene: SceneContext, private readonly light: LightService) {
    }

    clear(all = true) {
        if (this.activeSlot) {
            this.activeSlot.getChildMeshes(true).forEach(mesh => {
                mesh.disableEdgesRendering();
            });
            if (isDecalSlot(this.activeSlot)) {
                this.activeSlot.removeDecal();
            }
            this.activeSlot = undefined;
        }
        if (all) {
            this.camera.hideMiniMap();
            this.camera.resetMainCamera();
        }
        this.light.toggleHighlight(this.camera.mainCamera.position, true, this.scene.scene);
    }


    find<T extends SlotTransformNode>(term: string, searchedType: Type<T>): T {
        this.clear(false);
        const slots = this.scene.scene.transformNodes.filter(node => node instanceof searchedType) as T[];
        const foundIdx = Math.floor(Math.random() * slots.length);
        this.activeSlot = slots[foundIdx];
        this.activeSlot.getChildMeshes()[0].edgesColor = new Color4(0, 0, 1, 1);
        this.activeSlot.getChildMeshes()[0].edgesWidth = 10;
        this.activeSlot.getChildMeshes()[0].enableEdgesRendering(.9999);

        if (isDecalSlot(this.activeSlot)) {
            this.activeSlot.addDecal(this.activeSlot);
        }
        // @ts-ignore
        return this.activeSlot;
    }

    goto() {
        if (this.activeSlot) {
            this.camera.moveCameraAndLookAt(this.activeSlot.getAbsolutePosition());
            this.light.toggleHighlight(this.camera.mainCamera.position, true, this.scene.scene);
        }
    }
}
