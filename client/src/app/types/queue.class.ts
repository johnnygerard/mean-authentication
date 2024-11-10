export class Queue<T> {
  readonly #items: T[];

  constructor(...items: T[]) {
    this.#items = items;
  }

  get isEmpty(): boolean {
    return this.#items.length === 0;
  }

  get size(): number {
    return this.#items.length;
  }

  enqueue(item: T): void {
    try {
      this.#items.push(item);
    } catch (e) {
      throw new Error("Failed to enqueue item", { cause: e });
    }
  }

  dequeue(): T {
    if (this.isEmpty) throw new Error("Cannot dequeue from an empty queue");
    return this.#items.shift() as T;
  }

  peek(): T {
    if (this.isEmpty) throw new Error("Cannot peek at an empty queue");
    return this.#items[0];
  }

  toString(): string {
    return `Queue(${this.#items.join(", ")})`;
  }
}
