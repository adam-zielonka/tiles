import { Tile } from "./Tile";
import "./Tiles.scss";

export function Tiles() {
  document.body.style.backgroundColor = "white";

  return <div className="Tiles" style={{"--tile-min-width": "250px"}}>
    <Tile
      title="2077070707"
      description="200.777.001"
      value="42"
      info="Picking not started yet"
    />

    {[1,2,3,4,5,6,7].map(i => <Tile
      key={i}
      title="2077070707"
      description="200.777.001"
      value="6"
      info="TO: 1234567"
      leftInfo={`A1-0${i}`}
      color="transfer-order"
    />)}

    {[1,2,3,4,5,6,7].map(i => <Tile
      key={i}
      title="2077070707"
      description="200.777.001"
      value="6"
      info={`A1-0${i}`}
      color="pallet"
    />)}

    <Tile
      title="2077070707"
      description="200.777.001"
      value="6"
      info="Something is wrong with this pallet. It's broken or on the way somewhere."
      color="error"
    />

    {[0,1,2,3,4,5,6,7].map(i => <Tile
      key={i}
      title="2077070707"
      description="200.777.001"
      value="6"
      info={`Scanned: ${i}/6`}
      progress={i === 7 ? 0 : i * 100 / 6}
      color={i === 7 ? "error" : "empty"}
    />)}
  </div>;
}
