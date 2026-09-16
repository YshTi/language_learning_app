import loaderImage from "../../assets/loader.png";

import styles from "./Loader.module.css";

interface LoaderProps {
  size?: number;
}

const Loader = ({ size = 120 }: LoaderProps) => {
  return (
    <div
      className={styles.loader}
      style={{
        width: size,
        height: size,
      }}
      role="status"
      aria-label="Loading"
    >
      <img
        src={loaderImage}
        alt=""
        className={styles.backgroundImage}
      />

      <img
        src={loaderImage}
        alt=""
        className={styles.fillImage}
      />

      <span className={styles.visuallyHidden}>
        Loading...
      </span>
    </div>
  );
};

export default Loader;