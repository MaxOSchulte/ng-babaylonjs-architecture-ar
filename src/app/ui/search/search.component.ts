import {Component, OnInit} from '@angular/core';
import {Color4, Material} from '@babylonjs/core';
import {CameraService} from '../../services/camera.service';
import {LightService} from '../../services/light.service';
import {MaterialService} from '../../services/material.service';
import {SearchContext} from '../../services/search.context';
import {SceneContext} from '../../services/scene.context';
import {BoxSlot} from '../../slot/box.slot';
import {Pickable} from '../../interfaces/misc.interface';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

    showARButton = false;
    private inactiveMaterial: Material;

    constructor(private readonly scene: SceneContext,
                private readonly materialService: MaterialService,
                private readonly camera: CameraService,
                public readonly searchContext: SearchContext,
    ) { }

    ngOnInit() {
    }

    clear(all = true) {
        if (all) {
            this.materialService.activateBoxMaterials();
        }
        this.searchContext.clear(all);
        this.showARButton = false;
    }

    goto() {
        this.searchContext.goto();
        this.showARButton = true;
    }

    search(term: string) {
        this.clear(false);
        const activeSlot = this.searchContext.find(term, BoxSlot);
        this.materialService.deactivateBoxMaterials();
        activeSlot.getChildMeshes(true).forEach(mesh => {
            this.inactiveMaterial = mesh.material;
            mesh.material = this.materialService.getBoxActiveMaterial(mesh.material);
        });
        this.camera.displayMiniMap(this.scene.scene, activeSlot.position);
        activeSlot.enablePick(true);
    }

}
