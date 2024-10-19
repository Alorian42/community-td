import { container } from 'tsyringe';
import type Engine from './Engine';
import type EntityEngine from './EntityEngine';
import Player from '@shared/class/entity/Player';
import Enemy from '@shared/class/entity/Enemy';

export default class Game {
	private running: boolean = false;
	private engines: Record<string, Engine> = {};
	protected entityEngine!: EntityEngine;

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

		console.log('Game Engine started');
	}

	public init(): void {
		this.spawnPlayer();

		(window as any).spawnEnemy = (x: number, y: number) => {
			this.spawnEnemy(x, y);
		};
	}

	protected spawnPlayer(): void {
		this.entityEngine.spawnEntity(new Player(0, 0));
	}

	protected spawnEnemy(x: number, y: number): void {
		this.entityEngine.spawnEntity(new Enemy(x, y));
	}
}
