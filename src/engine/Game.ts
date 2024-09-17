import type Engine from "./Engine";

export default class Game {
	private running: boolean = false;
	private engines: Engine[] = [];

	public addEngine(engine: Engine): void {
		this.engines.push(engine);

		if (this.running) {
			engine.start();
		}
	}

	public start(): void {
		this.running = true;

		this.engines.forEach(engine => {
			engine.start();
		});

		console.log('Game Engine started');
	}
}