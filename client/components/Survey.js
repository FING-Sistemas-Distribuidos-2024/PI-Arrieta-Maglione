import SurveyOption from "./SurveyOption";

const Survey = () => {
    let options = ['red', 'blue', 'green'];

    return (
        <div>
            <h1>Survey</h1>
            <p>What is your favorite color?</p>
            <ul> 
                {options.map((option, index) => (
                    <SurveyOption key={index} option={option} votes={5} />
                ))}
            </ul>
        </div>
    );
}

export default Survey;