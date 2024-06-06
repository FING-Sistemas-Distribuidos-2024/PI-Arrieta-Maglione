import { baseUrl } from "@/constants";

const vote = async (team) => {
    const url = patchUrl(`api/vote?teamId=${team}`);
    try {
        const { ok, data } = await fetch(url, {
            method: 'POST',
            mode: 'cors',
        });

        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

const addOption = async (option) => {
    const url = patchUrl(`api/addOption?teamId=${option}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
        });

        return response;
    } catch (error) {
        console.log('Error:', error);
    }
}

const deleteTeam = async (teamId) => {
    const url = patchUrl(`/api/deleteOption?teamId=${teamId}`);
    try {
        const response = await fetch(url, {
            method: 'DELETE',  // Use the DELETE HTTP method
            mode: 'cors',
        });
        console.log(response)
        return response;
    } catch (error) {
        console.log('Error:', error);
    }
}


// Escape spaces in url
const patchUrl = (url) => {
    return url.replace(/ /g, "%20");
}

export { vote, addOption, deleteTeam };