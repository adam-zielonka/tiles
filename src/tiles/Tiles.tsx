import "./Tiles.scss";

export function Tiles() {
  return <div className="Tiles">
    <Tile
      title="Title"
      description="Description"
      value="Value"
      info="Right"
      leftInfo="Left"
    />
    <Tile
      title="Without desc."
      value="Value"
      info="Very long info is very long, very long info is very long."
    />
    <Tile
      title="456456456"
      description="789.789.789"
      value="42"
      info="123123123"
      leftInfo="12-AB"
    />
  </div>
}

type TileProps = {
  title: string;
  description?: string;
  value: string;
  info: string;
  leftInfo?: string;
}

function Tile({ title, description, value, info, leftInfo }: TileProps) {
  return <div className="Tile">
    <header>
      <h1>{title}</h1>
      <h2>{description}</h2>
    </header>
    <main>{value}</main>
    <footer>
      <p>{leftInfo}</p>
      <p title={info}>{info}</p>
    </footer>
  </div>
}
