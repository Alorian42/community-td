import map from "../../assets/maps/map0.json";
import Engine from "./Engine";
import type RenderEngine from "./RenderEngine";

export default class BackgroundEngine extends Engine {
	private renderEngine!: RenderEngine;

	public start(): void {
		this.renderEngine = this.container.resolve('renderEngine');

		this.renderEngine.onReady(() => {
			this.initBackground();
		});

		console.log("Background engine started.");
	}

	public initBackground(): void {
		const tileSize = 10;
		const scale = tileSize / 2;
		const { floor, objects } = map;

		Object.entries(floor).forEach(([key, value]) => {
			const [x, y, z] = key.split(',').map(Number);

			const mesh = this.renderEngine.getModel(value).scene.clone();
			mesh.scale.set(scale, scale, scale);
			mesh.position.set(x, z, y);

			this.renderEngine.renderMesh(mesh);
		});

		Object.entries(objects).forEach(([key, value]) => {
			const [x, y, z] = key.split(',').map(Number);

			const mesh = this.renderEngine.getModel(value).scene.clone();
			mesh.scale.set(scale, scale, scale);
			mesh.position.set(x, z, y);

			this.renderEngine.renderMesh(mesh);
		});
	}
}