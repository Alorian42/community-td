export abstract class EventSystem {
	protected subscriptions: Record<string, ((...args: any[]) => void)[]> = {};

	public on(event: string, callback: (...args: any[]) => void, oneTime: boolean = false): number {
		if (!this.subscriptions[event]) {
			this.subscriptions[event] = [];
		}

		const nextIndex = this.subscriptions[event].length;
		this.subscriptions[event].push((...args) => {
			callback(...args);
			if (oneTime) {
				this.off(event, nextIndex);
			}
		});

		return nextIndex;
	}

	public off(event: string, index: number): void {
		if (!this.subscriptions[event]) {
			return;
		}

		this.subscriptions[event].splice(index, 1);
	}

	protected emit(event: string, ...args: any[]): void {
		if (!this.subscriptions[event]) {
			return;
		}

		this.subscriptions[event].forEach(callback => {
			callback(...args);
		});
	}
}
