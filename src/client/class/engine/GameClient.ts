import { container } from 'tsyringe';
import Game from '@shared/class/engine/Game';
import type RenderEngine from './RenderEngine';
import type UnitEngine from './UnitEngine';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';

export default class GameClient extends Game {
	private renderEngine!: RenderEngine;
	protected unitEngine!: UnitEngine;

	public override start(): void {
		super.start();

		this.unitEngine = container.resolve('entityEngine');
		this.renderEngine = container.resolve('renderEngine');

		this.renderEngine.onReady(() => {
			this.init();
		});
	}

	protected override spawnPlayer(): void {
		this.unitEngine.spawnUnit(Player.fromXY(0, 0));
	}

	protected override spawnEnemy(x: number, y: number): void {
		this.unitEngine.spawnUnit(Enemy.fromXY(x, y));
	}
}
