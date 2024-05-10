import Unit from './Unit';

export default class Hero extends Unit {
	constructor(name: string, x: number, y: number) {
		super(name, 100, { x, y });
	}
}
