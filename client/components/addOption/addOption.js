import styles from './addOption.module.css';

const AddOption = ({ handleInputChange, handleSend, option }) => {
    return (
        <div className={styles.block}>
            <input className={styles.input} type="text" value={option} onChange={handleInputChange} placeholder="Enter new option" />
            <button className={styles.send} onClick={handleSend}>Add Option</button>
        </div>
    )
}

export default AddOption;