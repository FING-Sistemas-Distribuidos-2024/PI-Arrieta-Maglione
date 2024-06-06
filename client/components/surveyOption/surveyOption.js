import { deleteTeam, vote } from "@/services";
import styles from './surveyOption.module.css';

const SurveyOption = ({ option, votes }) => { // Change the parameter name from 'key' to 'option'
    const handleVote = async (option) => {
        await vote(option);
    }

    const handleDelete = async (option) => {
        await deleteTeam(option);
    }

    return (
        <div className={styles.option}>
            <span key={option}>{option}</span>
            <p>{votes}</p>
            <button className={styles.buttonGreen} onClick={() => handleVote(option)}>Vote</button>
            <button className={styles.buttonRed} onClick={() => handleDelete(option)}>Delete</button>
        </div>
    );
}

export default SurveyOption;
