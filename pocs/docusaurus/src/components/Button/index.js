import styles from './styles.module.css';

function Button({ color, text }) {
    return <button className={styles.button} style={{ backgroundColor: color }}>{text}</button>;
}

export default Button;
