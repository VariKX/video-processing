import s from "./style.module.scss";
import FileLoader from "./components/FileLoader/ui";

export default function Home() {
  return (
    <div className={s["home"]}>
      <FileLoader type="SLOW" />
      <div className={s["home__line"]} />
      <FileLoader type={"FAST"} />
    </div>
  );
}
