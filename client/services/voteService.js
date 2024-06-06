import { baseUrl } from "@/constants";

const vote = async (team) => {
    const url = `${baseUrl}/vote/${team}`;
    console.log(url)
    try {
        const {ok, data} = await fetch(url, {
            method: 'POST',
            mode: 'cors',
        });

        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

const addOption = async (option) => {
    console.log(option)
    const url = `${baseUrl}/team/${option}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
        });

        return response;        
    } catch (error) {
        console.log('Error:', error);
    }}

export {vote, addOption};