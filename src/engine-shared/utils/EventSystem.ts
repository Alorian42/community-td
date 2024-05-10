export default class EventSystem {
	protected subscribers = new Map<string, Array<() => void>>();

	public on(event: string, callback: () => void): void {
		if (!this.subscribers.has(event)) {
			this.subscribers.set(event, []);
		}

		this.subscribers.get(event)?.push(callback);
	}

	public publish(event: string): void {
		this.subscribers.get(event)?.forEach(callback => {
			callback();
		});
	}
}
