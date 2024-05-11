import EventSystem from '../utils/EventSystem';

export default abstract class Engine extends EventSystem {
	public name: string;

	constructor(name: string) {
		super();

		this.name = name;
	}

	public abstract start(): void;

	public abstract loop(): void;
}
