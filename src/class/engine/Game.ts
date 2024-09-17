import { container } from "tsyringe";
import type Engine from "./Engine";
import type RenderEngine from "./RenderEngine";
import type EntityEngine from "./EntityEngine";
import Player from "../entity/Player";
import Enemy from "../entity/Enemy";

export default class Game {
	private running: boolean = false;
	private engines: Record<string,Engine> = {};
	private renderEngine!: RenderEngine;
	private entityEngine!: EntityEngine;

	public addEngine(engine: Engine, name: string): void {
		this.engines[name] = engine;

		if (this.running) {
			container.register(name, { useValue: engine });
			engine.start();
		}
	}

	public start(): void {
		this.running = true;

		Object.entries(this.engines).forEach(([name, engine]) => {
			container.register(name, { useValue: engine });
		});

		Object.values(this.engines).forEach(engine => {
			engine.start();
		});

		this.entityEngine = container.resolve('entityEngine');
		this.renderEngine = container.resolve('renderEngine');

		console.log('Game Engine started');

		this.renderEngine.onReady(() => {
			this.init();
		});
	}

	public init(): void {
		this.spawnPlayer();

		(window as any).spawnEnemy = (x: number, y: number) => {
			this.spawnEnemy(x, y);
		};
	}

	private spawnPlayer(): void {
		this.entityEngine.spawnEntity(new Player(0, 0));
	}

	private spawnEnemy(x: number, y: number): void {
		this.entityEngine.spawnEntity(new Enemy(x, y));
	}
}