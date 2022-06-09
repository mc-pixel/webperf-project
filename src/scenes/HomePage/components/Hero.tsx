import s from "./Hero.module.css";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className={s.container}>
      <img className={s.image} src="bg.jpg" height="1080" width="1080" alt="" />
      <div className={s.center}>
        <h1 className={s.title}>Star fighter</h1>
        <Link className={s.button} to="/game">
          Start
        </Link>
      </div>
    </section>
  );
};

export default Hero;
