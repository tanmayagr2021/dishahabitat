import { AtlasStage } from "./AtlasStage";
import { Chapters } from "./Chapters";
import s from "./Atlas.module.css";

/* The moving map (client) behind the chapters (server-rendered). See AtlasStage.tsx for the idea. */
export function Atlas() {
  return (
    <div className={s.atlas}>
      <AtlasStage />
      <Chapters />
    </div>
  );
}
