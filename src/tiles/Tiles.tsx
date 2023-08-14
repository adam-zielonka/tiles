import { observer } from "mobx-react-lite";
import { store } from "./Store";
import { Tile } from "./Tile";
import "./Tiles.scss";

export const Tiles = observer(function Tiles() {
  document.body.style.backgroundColor = "white";
  document.getElementById("root")!.style.height = "100%";

  return <div className="TilesDemo">
    <header>
      Tiles
      <button onClick={() => store.toggleHighlight()}>Toggle Highlight</button>
    </header>
    <div className="Tiles" style={{"--tile-min-width": "250px"}}>
      {store.tiles.map((tile, i) => <Tile key={i} {...tile}/>)}
    </div>
    <footer>
      Footer
    </footer>
  </div>;
});
