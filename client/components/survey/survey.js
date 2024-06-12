import { useEffect, useState } from 'react';

import SurveyOption from "@/components/surveyOption";
import AddOption from '@/components/addOption';
import { addOption } from '@/services';

import styles from './survey.module.css';

const Survey = ({ options }) => {
    const [newOption, setNewOption] = useState('');

    const handleInputChange = (e) => {
        setNewOption(e.target.value);
    }

    const addTeam = async () => {
        await addOption(newOption);
        setNewOption('');
    }

    return (
        <div className={styles.parentContainer}>
            <h1 className={styles.title}>Survey</h1>
            <h2 className={styles.subtitle}>Vote for an option or add a new one</h2>
            <div className={styles.container}>
                {options.map((option, index) => (
                    <SurveyOption key={index} option={option.team} votes={option.votes} />
                ))}
            </div>
            <AddOption handleInputChange={handleInputChange} handleSend={addTeam} option={newOption} />
        </div>
    );
}

export default Survey;