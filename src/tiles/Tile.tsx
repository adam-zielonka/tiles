import { COLORS, Intent } from "./colors";
import { Highlight } from "./highlight";

export type TileProps = {
  title: string;
  description?: string;
  value: number;
  info?: string;
  leftInfo?: string;
  intent?: Intent;
  progress?: number;
}

export function Tile({ title, description, value, info, leftInfo, intent = "default", progress = 0 }: TileProps) {  
  return <div className="Wrapper" style={{
    "--tile-progress": `${progress}%`,
    "--tile-color": COLORS[intent].background,
    "--tile-font-color": COLORS[intent].font ?? "black",
    "--tile-highlight-color": COLORS[intent].font ? COLORS[intent].background : "black",
  }}>
    <div className="Tile">
      <section>
        <header>
          <h1><Highlight>{title}</Highlight></h1>
          <h2>{description}</h2>
        </header>
        <main>{value}</main>
      </section>
      <section>
        <p>{leftInfo}</p>
        <p title={info}>{info}</p>
      </section>
    </div>
  </div>;
}

