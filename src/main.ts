import { Engine } from 'excalibur';
import Player from './player';
import { loader } from './resources';

class Game extends Engine {
	constructor() {
		super({ width: 800, height: 600 });
	}

	public initialize(): void {
		const player = new Player();
		this.add(player);

		this.start(loader).catch(error => {
			console.error('Error loading game resources:', error);
		});
	}
}

const game = new Game();
game.initialize();

export default game;
