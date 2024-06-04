
const SurveyOption = ({ option, votes }) => { // Change the parameter name from 'key' to 'option'
    const handleClick = () => {

        fetch('/api/vote', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ option: option }), 
        }).then(async (res) => {
            if (res.status != 200) alert("Error: " + res.status)
        }).catch((err) => { 
            alert('Error:' + err);
        });
    };

    return (
        <div>
            <li key={option} onClick={handleClick}>{option}</li>
            <p>{votes}</p>
        </div>
    );
}

export default SurveyOption;
