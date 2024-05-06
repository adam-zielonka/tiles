import { COLORS, Intent } from "../store/colors";
import { Highlight } from "./highlight";
import { CubeIcon, BoxMultipleIcon, CubeOutlineIcon, BoxMultipleOutlineIcon } from "./icons";

type TileIcon = "plan" | "transfer" | "pick" | "post";
export type TileProps = {
  title: string;
  description?: string;
  value: number;
  info?: string;
  leftInfo?: string;
  intent?: Intent;
  progress?: number;
  icon: TileIcon;
}

export function Tile({ 
  title, description, value, info, leftInfo, intent = "default", progress = 0, icon
}: TileProps) {

  return <div style={{
    "--tile-color": COLORS[intent].background,
    "--tile-font-color": COLORS[intent].font ?? "black",
    "--tile-progress": `${intent !== "default" ? 0 : progress}%`,
  }}>
    <div className="Tile">
      <section>
        <header>
          <h1><Highlight>{title}</Highlight></h1>
          <h2>{description}</h2>
        </header>
        <main>
          <TileIcon icon={icon}/>
          {value}
        </main>
      </section>
      <section>
        <p>{leftInfo}</p>
        <p title={info}>{info}</p>
      </section>
    </div>
  </div>;
}

function TileIcon({ icon }:{ icon: TileIcon }) {
  switch (icon) {
    case "plan": return <BoxMultipleIcon/>;
    case "transfer": return <CubeIcon/>;
    case "pick": return <CubeOutlineIcon/>;
    case "post": return <BoxMultipleOutlineIcon/>;
  }
}
