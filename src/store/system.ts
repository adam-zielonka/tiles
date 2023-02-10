import { makeAutoObservable } from "mobx";
import { store } from "./store";
import { process } from "../utils/process";

export class System {
  private state: "processing" | "shutdown" | "freeze" | "" = "";

  constructor() {
    makeAutoObservable(this);
  }

  get shutdown(): boolean {
    return this.state === "shutdown";
  }

  get isInputAllowed(): boolean {
    return !["freeze", "processing"].includes(this.state);
  }

  startProcessing(): void {
    this.state = "processing";
  }

  stopProcessing(): void {
    if (this.state === "processing") {
      this.state = "";
    }
  }

  setShutdown(): void {
    this.state = "shutdown";
  }

  setFreeze(): void {
    this.state = "freeze";
  }

  async addCommand(command: string): Promise<void> {
    store.system.startProcessing();
    await store.output.processCommandLine(command);
    await process(command);
    store.system.stopProcessing();
  }

  async start(startCommands: string[]): Promise<void> {
    store.system.startProcessing();
    for (const command of startCommands) {
      store.history.set(command);
      store.history.add();
      await store.output.processCommandLine(command, true);
      await process(command);
    }
    store.system.stopProcessing();
  }
}
