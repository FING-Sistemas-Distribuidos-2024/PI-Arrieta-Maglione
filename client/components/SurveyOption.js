import { vote } from "@/services";

const SurveyOption = ({ option, votes }) => { // Change the parameter name from 'key' to 'option'
    const handleVote = async (option) => {
        await vote(option);
    }
    return (
        <div>
            <li key={option} onClick={() => handleVote(option)}>{option}</li>
            <p>{votes}</p>
        </div>
    );
}

export default SurveyOption;
