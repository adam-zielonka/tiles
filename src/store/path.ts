import { makeAutoObservable } from "mobx";

function cd(dir: string, newDir: string): string {
  if (newDir === "..") {
    const parts = dir.split("/");
    parts.pop();
    if (parts.length === 0 || parts[0] === "") {
      return "/";
    }
    return parts.join("/");
  } else if (newDir === ".") {
    return dir;
  } else if (newDir === "~") {
    return "~";
  } else if (newDir === "") {
    return dir;
  } else if (newDir.startsWith("/")) {
    return newDir
      .replace(/\/\//, "/")
      .replace(/.\/$/, "")
      .replace(/^\/root/, "~");
  } else {
    return `${dir}/${newDir}`
      .replace(/\/\//, "/")
      .replace(/.\/$/, "")
      .replace(/^\/root/, "~");
  }
}

export class Path {
  value = "~";

  constructor() {
    makeAutoObservable(this);
  }

  cd(newDir: string): void {
    this.value = cd(this.value, newDir);
  }
}
