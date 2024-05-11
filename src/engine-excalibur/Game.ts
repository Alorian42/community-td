import { Engine, Color, PointerButton, type Sprite, Vector, type Scene, Keys } from 'excalibur';
import Player from './actors/Player';
import Resources from './Resources';
import Enemy from './actors/Enemy';
import MainScene from './scenes/Main';
import SceneController from './controllers/SceneController';
import Tower from './actors/Tower';
import MainEngine from '../engine-shared/engines/MainEngine';
import { UnitEvents } from '../engine-shared/unit/Unit';
import BuildButton from './ui/BuildButton';
import ResourcesText from './ui/ResourcesText';
import BasicTower from '../engine-shared/tower/BasicTower';
import TowerUtils from '../engine-shared/utils/TowerUtils';

export default class Game extends Engine {
	/**
	 * Game resources
	 */
	private readonly resources: Resources;

	private player: Player | null = null;
	private readonly enemies: Enemy[] = [];
	private readonly mainEngine: MainEngine;

	private buildMode: boolean = false;

	private readonly cameraMovement: { x: number; y: number } = { x: 0, y: 0 };
	private manualCameraMovement: boolean = true;

	private targetPos?: Vector;

	private resourcesText: ResourcesText | null = null;

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
			this.mainEngine.awardResources(enemy.getUnit());

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
			if (TowerUtils.canBuildTowerByClass(this.mainEngine.getCurrentResources(), BasicTower)) {
				this.buildMode = true;
			} else {
				alert('Not enough resources to build a tower');
			}
		};

		scene.add(button);
	}

	public initialize(): void {
		const loader = this.resources.loadResources();
		const scene = new MainScene();
		this.resourcesText = new ResourcesText(300, 10);
		this.player = new Player(100, 100);
		this.createEnemy(scene);

		this.add(scene.getName(), scene);
		scene.add(this.resourcesText);
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

				if (event.key === Keys.ArrowUp) {
					this.manualCameraMovement = true;
					this.cameraMovement.y = -2;
				} else if (event.key === Keys.ArrowDown) {
					this.manualCameraMovement = true;
					this.cameraMovement.y = 2;
				} else if (event.key === Keys.ArrowLeft) {
					this.manualCameraMovement = true;
					this.cameraMovement.x = -2;
				} else if (event.key === Keys.ArrowRight) {
					this.manualCameraMovement = true;
					this.cameraMovement.x = 2;
				}
			});

			this.input.keyboard.on('release', event => {
				if (event.key === Keys.ArrowUp || event.key === Keys.ArrowDown) {
					this.cameraMovement.y = 0;

					this.manualCameraMovement = this.cameraMovement.x !== 0;
				} else if (event.key === Keys.ArrowLeft || event.key === Keys.ArrowRight) {
					this.cameraMovement.x = 0;

					this.manualCameraMovement = this.cameraMovement.y !== 0;
				}
			});

			this.input.pointers.primary.on('move', event => {
				if (this.manualCameraMovement) {
					return;
				}

				if (event.pagePos.x <= 40) {
					this.cameraMovement.x = -2;
				} else if (event.pagePos.x >= 780) {
					this.cameraMovement.x = 2;
				} else {
					this.cameraMovement.x = 0;
				}

				if (event.pagePos.y <= 40) {
					this.cameraMovement.y = -2;
				} else if (event.pagePos.y >= 580) {
					this.cameraMovement.y = 2;
				} else {
					this.cameraMovement.y = 0;
				}
			});

			this.onPreDraw = () => {
				if (this.buildMode) {
					const targetPos = this.input.pointers.primary.lastPagePos;

					this.graphicsContext.drawRectangle(
						targetPos.add(new Vector(-50, -50)),
						100,
						100,
						this.canBuild() ? Color.Green : Color.Red
					);
				}

				if (this.targetPos !== undefined && this.player !== null) {
					const playerPosScreen = this.worldToScreenCoordinates(this.player.pos);
					const targetPosScreen = this.worldToScreenCoordinates(this.targetPos);

					this.graphicsContext.drawLine(playerPosScreen, targetPosScreen, Color.Green, 1);
					this.graphicsContext.drawCircle(targetPosScreen, 5, Color.Green);
				}
			};

			this.onPreUpdate = () => {
				if (this.currentScene.camera.pos.x < -500 && this.cameraMovement.x < 0) {
					this.cameraMovement.x = 0;
				}

				if (this.currentScene.camera.pos.x > 800 && this.cameraMovement.x > 0) {
					this.cameraMovement.x = 0;
				}

				if (this.currentScene.camera.pos.y < -500 && this.cameraMovement.y < 0) {
					this.cameraMovement.y = 0;
				}

				if (this.currentScene.camera.pos.y > 800 && this.cameraMovement.y > 0) {
					this.cameraMovement.y = 0;
				}

				if (this.cameraMovement.x !== 0) {
					this.currentScene.camera.pos.x += this.cameraMovement.x;
				}

				if (this.cameraMovement.y !== 0) {
					this.currentScene.camera.pos.y += this.cameraMovement.y;
				}
			};

			this.createBuildButton(scene);

			this.mainEngine.start();

			this.mainEngine.awardResources();
		});

		this.canvas.addEventListener('contextmenu', e => {
			e.preventDefault();
		});

		this.start(loader).catch(error => {
			console.error('Error loading game resources:', error);
		});

		this.mainEngine.subscribeToResourceAward(({ delta, total }) => {
			console.log('Resources awarded', delta, total);
			this.resourcesText?.updateResources(total);
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
				this.targetPos = targetPos;

				event.nativeEvent.preventDefault();
			} else if (event.button === PointerButton.Left) {
				if (this.buildMode && this.canBuild()) {
					const targetPos = this.screenToWorldCoordinates(event.screenPos);

					if (TowerUtils.canBuildTowerByClass(this.mainEngine.getCurrentResources(), BasicTower)) {
						this.createTower(this.currentScene, targetPos.x, targetPos.y);
					}

					if (!TowerUtils.canBuildTowerByClass(this.mainEngine.getCurrentResources(), BasicTower)) {
						this.buildMode = false;
					}
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

	public clearTargetPos(): void {
		this.targetPos = undefined;
	}
}
