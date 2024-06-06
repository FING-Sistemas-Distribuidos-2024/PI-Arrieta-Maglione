import { useEffect, useState } from 'react';

import SurveyOption from "./SurveyOption";
import { addOption } from '@/services';

const Survey = ({options}) => {
    const [newOption, setNewOption] = useState('');

    const handleInputChange = (e) => {
        setNewOption(e.target.value);
    }

    const addTeam = async (team) => {
        await addOption(team);
        setNewOption('');        
    }

    return (
        <div>
            <h1>Survey</h1>
            <p>What is your favorite color?</p>
            <ul> 
                {options.map((option, index) => (
                    <SurveyOption key={index} option={option.team} votes={option.votes} />
                ))}
            </ul>
            <input type="text" value={newOption} onChange={handleInputChange} placeholder="Enter new option" />
            <button onClick={() => addTeam(newOption)}>Add Option</button>
        </div>
    );
}

export default Survey;