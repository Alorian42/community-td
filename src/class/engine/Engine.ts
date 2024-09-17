import { container } from "tsyringe";

export default abstract class Engine {
	protected container = container;

	public abstract start(): void;
}