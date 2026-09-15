import { Link } from "react-router-dom";
import { BiSolidCircleHalf } from "react-icons/bi";
import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      <span className={styles.iconWrapper} aria-hidden="true">
        <BiSolidCircleHalf className={styles.topHalf} />
        <BiSolidCircleHalf className={styles.bottomHalf} />
      </span>

      <span className={styles.text}>LearnLingo</span>
    </Link>
  );
};

export default Logo;