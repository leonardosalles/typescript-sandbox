import styles from './styles.module.css';

function Button({ color, children }) {
  return <button className={styles.button} style={{ backgroundColor: color }}>{children}</button>;
}

export default Button;
