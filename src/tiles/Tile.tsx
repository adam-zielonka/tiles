type TileProps = {
  title: string;
  description?: string;
  value: string;
  info: string;
  leftInfo?: string;
}

export function Tile({ title, description, value, info, leftInfo }: TileProps) {
  return <div className="Wrapper">
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
