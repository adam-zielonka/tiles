import { describe, test, beforeEach, expect } from "vitest";
import { History } from "../store/history";

describe("History", () => {
  let history: History;

  beforeEach(() => {
    history = new History();
  });

  test("value should return the current value", () => {
    history.set("Hello");
    expect(history.value).toBe("Hello");
  });

  test("lastCommand should return nothing on empty history", () => {
    expect(history.lastCommand).toBe("");
  });

  test("lastCommand should return the last command", () => {
    history.set("Command 1");
    history.add();
    history.set("Command 2");
    history.add();
    expect(history.lastCommand).toBe("Command 2");
  });

  test("set should update the value", () => {
    history.set("Hello");
    expect(history.value).toBe("Hello");
  });

  test("add should add the value to history", () => {
    history.set("Command 1");
    history.add();
    expect(history.lastCommand).toBe("Command 1");
  });

  test("up should move the position up", () => {
    history.set("Command 1");
    history.add();
    history.set("Command 2");
    history.add();
    history.set("Command 3");
    history.add();
    history.up();
    expect(history.value).toBe("Command 3");
  });

  test("down should move the position down", () => {
    history.set("Command 1");
    history.add();
    history.set("Command 2");
    history.add();
    history.set("Command 3");
    history.add();
    history.up();
    history.up();
    history.down();
    expect(history.value).toBe("Command 3");
  });
});
