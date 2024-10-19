import { container } from 'tsyringe';
import { EventSystem } from '@shared/class/utils/EventSystem';

export default abstract class Engine extends EventSystem {
	protected container = container;

	public abstract start(): void;
}
