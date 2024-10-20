import { container } from 'tsyringe';
import Game from '@shared/class/engine/Game';
import type RenderEngine from './RenderEngine';
import type UnitEngine from './UnitEngine';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import Tower from '../entity/Tower';
import MapUtils from '@shared/class/utils/Map';
import type TowerEngine from '@shared/class/engine/TowerEngine';

export default class GameClient extends Game {
	private renderEngine!: RenderEngine;
	private towerEngine!: TowerEngine;
	protected unitEngine!: UnitEngine;

	public override start(): void {
		super.start();

		this.unitEngine = container.resolve('entityEngine');
		this.renderEngine = container.resolve('renderEngine');
		this.towerEngine = container.resolve('towerEngine');

		this.renderEngine.onReady(() => {
			this.init();
		});

		this.renderEngine.on('spawnTower', (gridX: number, gridY: number) => {
			this.spawnTower(gridX, gridY);
		});
	}

	protected override spawnPlayer(): void {
		this.unitEngine.spawnUnit(Player.fromXY(0, 0));
	}

	protected override spawnEnemy(x: number, y: number): void {
		this.unitEngine.spawnUnit(Enemy.fromXY(x, y));
	}

	protected override spawnTower(gridX: number, gridY: number): void {
		if (!this.towerEngine.canBuild(gridX, gridY)) {
			return;
		}

		const { x, y } = MapUtils.fromGridToMap(gridX, gridY);
		const tower = Tower.fromXY(x, y);
		this.unitEngine.spawnUnit(tower);
		this.towerEngine.buildTower(gridX, gridY, tower.getEntity());
	}
}
