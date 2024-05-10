export default abstract class Engine {
	public name: string;

	constructor(name: string) {
		this.name = name;
	}

	public abstract start(): void;

	public abstract loop(): void;
}
