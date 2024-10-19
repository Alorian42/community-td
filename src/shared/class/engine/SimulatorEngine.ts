import Engine from '@/shared/class/engine/Engine';
import type EntityEngine from '@/shared/class/engine/EntityEngine';

export default class SimulatorEngine extends Engine {
	private fps: number = 30;
	private lastTime: number = 0;
	private intervalId: number | null = null;
	private defaultTickRate: number = 1000 / this.fps;
	private entityEngine!: EntityEngine;

	public start(): void {
		this.entityEngine = this.container.resolve('entityEngine');

		console.log('Simulator engine started.');
		this.startLoop();
	}

	private startLoop(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}

		const frameTime = 1000 / this.fps;
		this.lastTime = Date.now();
		this.intervalId = setInterval(() => {
			this.loop();
		}, frameTime);
	}

	private loop(): void {
		const currentTime = Date.now();
		const deltaTime = currentTime - this.lastTime;
		this.lastTime = currentTime;

		const factor = deltaTime / this.defaultTickRate;

		this.moveEntities(factor);
	}

	private moveEntities(factor: number): void {
		const entities = this.entityEngine.getEntities();

		entities.forEach(entity => {
			entity.move(factor);
		});
	}
}
