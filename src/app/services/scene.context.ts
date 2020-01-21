import {ElementRef, Injectable} from '@angular/core';
import {Color3, Color4, Scene, SSAORenderingPipeline} from '@babylonjs/core';
import '@babylonjs/inspector';
import {CameraService} from './camera.service';
import {EngineContext} from './engine.context';
import {LightService} from './light.service';

@Injectable({
    providedIn: 'root'
})
export class SceneContext {
    scene: Scene;

    constructor(
        private engineCtx: EngineContext,
        private readonly lightService: LightService,
        private readonly camera: CameraService
    ) {
    }

    createMyScene(canvas: ElementRef<HTMLCanvasElement>) {
        this.engineCtx.canvas = canvas;
        this.scene = new Scene(this.engineCtx.engine);

        this.camera.setup(this.scene, canvas.nativeElement);
        const ssao = new SSAORenderingPipeline(
            'ssaoPipeline',
            this.scene,
            0.75,
            [this.camera.mainCamera]
        );

        this.scene.clearColor = Color4.FromColor3(new Color3(0, 0, 0));
        this.lightService.addPointLights(this.scene);

        this.lightService.toggleHighlight(
            this.camera.mainCamera.position,
            true,
            this.scene
        );

        // Prevent scrolling when touching the canvas
        this.disableCanvasEvents(canvas);
    }

    startMyScene() {
        this.engineCtx.start(this.scene);
    }

    enableVR(canvas: ElementRef<HTMLCanvasElement>) {
        const vrHelper = this.scene.createDefaultVRExperience({
            createDeviceOrientationCamera: true
        });

        vrHelper.teleportationEnabled = true;
        vrHelper.enableInteractions();

        vrHelper.onExitingVR.add(() => {
            this.camera.resetActiveCamera(this.scene, canvas.nativeElement);
        });

        vrHelper.onEnteringVRObservable.add(() => {
            this.scene.activeCamera.position = this.camera.mainCamera.position;
        });
    }

    displayDebugLayer() {
        if (!this.scene.debugLayer.isVisible()) {
            this.scene.debugLayer.show({overlay: true, embedMode: true});
        } else {
            this.scene.debugLayer.hide();
        }
    }

    private disableCanvasEvents(canvas: ElementRef<HTMLCanvasElement>) {
        document.body.addEventListener('touchstart', e => this.preventDefault(e, canvas), {passive: false});
        document.body.addEventListener('touchend', e => this.preventDefault(e, canvas), {passive: false});
        document.body.addEventListener('touchmove', e => this.preventDefault(e, canvas), {passive: false});
    }

    private preventDefault(e: Event, ref: ElementRef) {
        if (e.target === ref.nativeElement) {
            e.preventDefault();
        }
    }
}
