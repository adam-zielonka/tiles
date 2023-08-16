import { useEffect, useRef, useState } from "react";
import { COLORS, Intent } from "./colors";
import { Highlight } from "./highlight";
import { store } from "./store";
import { observer } from "mobx-react-lite";
import { CubeIcon, BoxMultipleIcon, CubeOutlineIcon, BoxMultipleOutlineIcon } from "./icons";

export type TileProps = {
  title: string;
  description?: string;
  value: number;
  info?: string;
  leftInfo?: string;
  intent?: Intent;
  progress?: number;
  icon: "plan" | "transfer" | "pick" | "post";
}

export const Tile = observer(function ({ title, description, value, info, leftInfo, intent = "default", progress = 0,
  icon }: TileProps) {

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(240);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
  }, [store.dimensions.width]);


  function Icon() {
    switch (icon) {
      case "plan": return <BoxMultipleIcon/>;
      case "transfer": return <CubeIcon/>;
      case "pick": return <CubeOutlineIcon/>;
      case "post": return <BoxMultipleOutlineIcon/>;
    }
  }

  const insideTile = <div className="Tile">
    <section>
      <header>
        <h1><Highlight>{title}</Highlight></h1>
        <h2>{description}</h2>
      </header>
      <main>
        <Icon/>
        {value}
      </main>
    </section>
    <section>
      <p>{leftInfo}</p>
      <p title={info}>{info}</p>
    </section>
  </div>;

  return <div ref={ref} style={{
    "--tile-color": COLORS[intent].background,
    "--tile-font-color": COLORS[intent].font ?? "black",
    "--tile-highlight-color": COLORS[intent].font ? COLORS[intent].background : "black",
  }}>
    {insideTile}
    {progress > 0 && <div className="tile-progress" style={{ width: `${progress}%` }}>
      <div style={{ width }}>
        {insideTile}
      </div>
    </div>}
  </div>;
});
