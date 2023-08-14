import { Tile } from "./Tile";
import "./Tiles.scss";

export function Tiles() {
  document.body.style.backgroundColor = "white";
  document.getElementById("root")!.style.height = "100%";

  return <div className="TilesDemo">
    <header>Tiles</header>
    <div className="Tiles" style={{"--tile-min-width": "250px"}}>
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
        intent="transfer-order"
      />)}

      {[1,2,3,4,5,6,7].map(i => <Tile
        key={i}
        title="2077070707"
        description="200.777.001"
        value="6"
        info={`A1-0${i}`}
        intent="pallet"
      />)}

      <Tile
        title="2077070707"
        description="200.777.001"
        value="6"
        info="Something is wrong with this pallet. It's broken or on the way somewhere."
        intent="error"
      />

      {[0,1,2,3,4,5,6].map(i => <Tile
        key={i}
        title="2077070707"
        description="200.777.001"
        value="6"
        info={i ? `Scanned: ${i}/6` : "Ready to scan"}
        progress={i * 100 / 6}
      />)}

      <Tile
        title="2077070707"
        description="200.777.001"
        value="6"
        info="Some scanned pallet have a problem"
        progress={1 * 100 / 6}
        intent="error"
      />

      <Tile
        title="2077070707"
        description="200.777.001"
        value="6"
        info="Scanned: 12/6"
        intent="error"
      />

      <Tile
        title="2077070707"
        value="42"
        info="Everything is done"
        intent="pallet"
      />
    </div>
    <footer>
      Footer
    </footer>
  </div>;
}
