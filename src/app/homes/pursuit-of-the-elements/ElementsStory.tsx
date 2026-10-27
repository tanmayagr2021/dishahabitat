import { elements as e } from "@/lib/elements";
import s from "./ElementsStory.module.css";

/*
 * The five elements, told as you scroll. On a computer with motion allowed, a tall track holds a
 * sticky stage: each word grows to the front in turn while the project's own sentence stays put and a
 * brass line fills. Everywhere else it is a plain heading, the five words and the sentence.
 */
export function ElementsStory() {
  return (
    <section className={s.story} data-tone="dark" aria-labelledby="idea-title">
      <div className={s.track}>
        <div className={s.stage}>
          <div className={s.inner}>
            <div className={s.words}>
              <span className={s.rail} aria-hidden="true">
                <span className={s.fill} />
              </span>
              <ul className={`display ${s.list}`} aria-label="The five elements">
                {e.fiveElements.map((el) => (
                  <li key={el} className={s.word}>
                    {el}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.copy}>
              <h2 id="idea-title" className="eyebrow">
                Inspired by the five elements
              </h2>
              <p className={s.sentence}>{e.intro}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
