export default class EventSystem {
	protected subscribers = new Map<string, Map<number, (...args: any) => void>>();
	protected count = 0;

	public on(event: string, callback: (...args: any) => void, oneTime?: boolean): number {
		if (!this.subscribers.has(event)) {
			this.subscribers.set(event, new Map());
		}

		this.count += 1;
		this.subscribers.get(event)?.set(this.count, (...args: any) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			callback(...args);
			if (oneTime) {
				this.off(event, this.count);
			}
		});

		return this.count;
	}

	public publish(event: string, ...args: any): void {
		this.subscribers.get(event)?.forEach(callback => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			callback(...args);
		});
	}

	public off(event: string, id: number): void {
		this.subscribers.get(event)?.delete(id);
	}
}
