import { makeAutoObservable } from "mobx";
import { store } from "./store";

export class History {
  private history: string[] = [];
  private position = 0;
  private temporaryValue = "";
  completionIndex = -1;

  constructor() {
    makeAutoObservable(this);
  }

  get value(): string {
    return this.history[this.position] || this.temporaryValue;
  }

  get lastCommand(): string {
    return this.history[this.history.length - 1] || "";
  }

  get completions(): string[] {
    return store.commands.getCompletions(this.value);
  }

  get showCompletion(): boolean {
    return this.completionIndex >= 0;
  }

  resetCompletions(): void {
    this.completionIndex = -1;
  }

  nextCompletion(): void {
    if (this.completions.length === 1) {
      this.set(this.completions[0]);
    } else {
      this.completionIndex =
      this.completionIndex + 1 < this.completions.length
        ? this.completionIndex + 1
        : 0;
    }
  }

  set(value: string): void {
    this.position = this.history.length;
    this.temporaryValue = value;
  }

  add(): void {
    if (this.value && this.value !== this.history[this.history.length - 1]) {
      this.history.push(this.value);
    }
    this.set("");
  }

  up(): void {
    this.position - 1 >= 0 && --this.position;
  }

  down(): void {
    this.position + 1 <= this.history.length && ++this.position;
  }
}
