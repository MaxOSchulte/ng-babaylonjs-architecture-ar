import {Component, OnInit} from '@angular/core';
import {Color4, Material} from '@babylonjs/core';
import {CameraContext} from '../../services/camera.context';
import {LightContext} from '../../services/light.context';
import {MaterialService} from '../../services/material.service';
import {SearchContext} from '../../services/search.context';
import {SceneContext} from '../../services/scene.context';
import {BoxSlot} from '../../slots/box.slot';
import {Pickable} from '../../interfaces/pickable.interface';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

    private inactiveMaterial: Material;

    constructor(private readonly scene: SceneContext,
                private readonly materialService: MaterialService,
                private readonly camera: CameraContext,
                public readonly searchContext: SearchContext,
    ) { }

    ngOnInit() {
    }

    clear(all = true) {
        if (all) {
            this.materialService.activateBoxMaterials();
        }
        this.searchContext.clear(all);
    }

    goto() {
        this.searchContext.goto();
    }

    search(term: string) {
        this.clear(false);
        const activeSlot = this.searchContext.findSlot(term, BoxSlot);
        this.materialService.deactivateBoxMaterials();
        activeSlot.getChildMeshes(true).forEach(mesh => {
            this.inactiveMaterial = mesh.material;
            mesh.material = this.materialService.getBoxActiveMaterial(mesh.material);
        });
        this.camera.displayMiniMap(this.scene.scene, activeSlot.position);
        activeSlot.enablePick(true);
    }

}
