export default class Unit {
	public name: string;
	public currentHealth: number;
	public maxHealth: number;

	constructor(name: string, health: number) {
		this.name = name;
		this.currentHealth = health;
		this.maxHealth = health;
	}
}
