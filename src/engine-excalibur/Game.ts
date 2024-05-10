import { Engine, Color, PointerButton, type Sprite, Vector, type Scene } from 'excalibur';
import Player from './actors/Player';
import Resources from './Resources';
import Enemy from './actors/Enemy';
import MainScene from './scenes/Main';
import SceneController from './controllers/SceneController';
import Tower from './actors/Tower';
import MainEngine from '../engine-shared/engines/MainEngine';
import { UnitEvents } from '../engine-shared/unit/Unit';
import BuildButton from './ui/BuildButton';

export default class Game extends Engine {
	/**
	 * Game resources
	 */
	private readonly resources: Resources;

	private player: Player | null = null;
	private readonly enemies: Enemy[] = [];
	private readonly mainEngine: MainEngine;

	private buildMode: boolean = false;

	constructor() {
		super({ width: 800, height: 600 });

		this.resources = new Resources();
		this.mainEngine = new MainEngine();
	}

	protected createEnemy(scene: Scene): Enemy {
		const enemy = new Enemy(300, 300);

		enemy.getUnit().on(UnitEvents.DEATH, () => {
			this.enemies.splice(this.enemies.indexOf(enemy), 1);
			SceneController.unregisterActor(scene, enemy);

			window.setTimeout(() => {
				this.createEnemy(scene);
			}, 1000);
		});

		this.enemies.push(enemy);
		this.mainEngine.registerEnemy(enemy.getUnit());
		SceneController.registerActor(scene, enemy);

		enemy.moveTo(300, 425);

		return enemy;
	}

	protected createTower(scene: Scene, x: number, y: number): Tower {
		const tower = new Tower(x, y);

		this.mainEngine.registerTower(tower.getUnit());
		SceneController.registerActor(scene, tower);

		return tower;
	}

	protected createBuildButton(scene: Scene): void {
		const button = new BuildButton();

		button.onBuildModeEnter = () => {
			this.buildMode = true;
		};

		scene.add(button);
	}

	public initialize(): void {
		const loader = this.resources.loadResources();
		const scene = new MainScene();
		this.player = new Player(100, 100);
		this.createEnemy(scene);

		this.add(scene.getName(), scene);
		SceneController.registerActor(scene, this.player);

		loader.on('afterload', () => {
			this.input.pointers.clear();
			this.goToScene(scene.getName()).catch(error => {
				console.error('Error loading scene:', error);
			});
			this.initMovement();

			this.input.keyboard.on('press', event => {
				if (event.key === 'Escape') {
					this.buildMode = false;
				}
			});

			this.onPreDraw = () => {
				if (this.buildMode) {
					const targetPos = this.screenToWorldCoordinates(this.input.pointers.primary.lastPagePos);

					this.graphicsContext.drawRectangle(
						targetPos.add(new Vector(-50, -50)),
						100,
						100,
						this.canBuild() ? Color.Green : Color.Red
					);
				}
			};

			this.createBuildButton(scene);

			this.mainEngine.start();
		});

		this.canvas.addEventListener('contextmenu', e => {
			e.preventDefault();
		});

		this.start(loader).catch(error => {
			console.error('Error loading game resources:', error);
		});
	}

	public initMovement(): void {
		this.input.pointers.primary.on('down', event => {
			if (event.button === PointerButton.Right) {
				if (this.player === null) {
					return;
				}

				if (this.buildMode) {
					this.buildMode = false;
					return;
				}

				const targetPos = this.screenToWorldCoordinates(event.screenPos);

				this.player.moveTo(targetPos.x, targetPos.y);

				event.nativeEvent.preventDefault();
			} else if (event.button === PointerButton.Left) {
				if (this.buildMode && this.canBuild()) {
					const targetPos = this.screenToWorldCoordinates(event.screenPos);

					this.createTower(this.currentScene, targetPos.x, targetPos.y);
				}
			}
		});
	}

	public getSprite(name: string): Sprite {
		const resources = this.resources.getResources();

		if (resources[name] === undefined) {
			throw new Error(`Sprite ${name} not found`);
		}

		return resources[name].toSprite();
	}

	private canBuild(): boolean {
		const targetPos = this.screenToWorldCoordinates(this.input.pointers.primary.lastPagePos);
		const towers = SceneController.getActorsOfType<Tower>(this.currentScene, Tower);

		return towers.every(tower => tower.pos.distance(targetPos) >= 100);
	}
}
