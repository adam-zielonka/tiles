import { observer } from "mobx-react-lite";
import { store } from "./store";
import { Tile } from "./tile";
import "./tiles.scss";

export const Tiles = observer(function Tiles() {
  document.body.style.backgroundColor = "white";
  document.getElementById("root")!.style.height = "100%";

  return <div className="TilesDemo">
    <header>
      Tiles
      <main>
        <button onClick={() => store.back()}>--</button>
        <button onClick={() => store.filter(-1)} className={
          -1 === store.step ? "active" : ""
        }>all</button>
        {[0,1,2,3,4,5].map(i => 
          <button key={i} onClick={() => store.filter(i)} className={
            i === store.step ? "active" : ""
          }>{i}</button>)}
        <button onClick={() => store.next()}>++</button>
      </main>
      <button onClick={() => store.toggleHighlight()} className={
        store.highlight === true ? "active" : ""
      }>Highlight</button>
    </header>
    <div className="Tiles" style={{"--tile-min-width": "250px"}}>
      {/* {store.system.tiles.map((tile, i) => <Tile key={i} {...tile}/>)} */}
      {store.tiles.map((tile, i) => <Tile key={i} {...tile}/>)}
    </div>
    <footer>
      Footer
    </footer>
  </div>;
});
