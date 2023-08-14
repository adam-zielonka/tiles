type TileProps = {
  title: string;
  description?: string;
  value: string;
  info: string;
  leftInfo?: string;
  color?: TileColor;
  progress?: number;
}

type TileColor = "empty" | "transfer-order" | "pallet" | "error";

function mapColor(color: TileColor | undefined): string {
  switch (color) {
    case "transfer-order":
      return "lightblue";
    case "pallet":
      return "lightgreen";
    case "error":
      return "red";
    default:
      return "white";
  }
}

export function Tile({ title, description, value, info, leftInfo, color, progress = 0 }: TileProps) {  
  return <div className="Wrapper" style={{
    "--tile-progress": `${progress}%`,
    "--tile-color": mapColor(color),
    "--tile-font-color": color === "error" ? "white" : "black",
  }}>
    <div className="Tile">
      <section>
        <header>
          <h1>{title}</h1>
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
