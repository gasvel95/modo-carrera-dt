import styles from "./PlayerCareer.module.css";

export function GameModeSelector({ onManager, onPlayer }: { onManager: () => void; onPlayer: () => void }) {
  return <section className={styles.modeSelect} aria-labelledby="mode-title">
    <div className={styles.modeHeading}>
      <p>ELEGÍ TU HISTORIA</p>
      <h1 id="mode-title">DOS CARRERAS.<br /><em>UNA MISMA PASIÓN.</em></h1>
      <span>Dirigí desde el banco o ganate un lugar adentro de la cancha.</span>
    </div>
    <div className={styles.modeCards}>
      <button type="button" onClick={onManager}>
        <i>DT</i><small>MODO ORIGINAL</small><strong>CARRERA DE<br />DIRECTOR TÉCNICO</strong><span>Tomá decisiones, armá el equipo y llevá un club del ascenso hasta la gloria.</span><b>JUGAR COMO DT →</b>
      </button>
      <button type="button" className={styles.playerMode} onClick={onPlayer}>
        <i>10</i><small>NUEVO MODO</small><strong>JUGADOR<br />DEL ASCENSO</strong><span>Debutá en Primera D, crecé partido a partido y construí una carrera hasta el retiro.</span><b>JUGAR COMO FUTBOLISTA →</b>
      </button>
    </div>
  </section>;
}

