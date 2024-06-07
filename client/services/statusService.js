const getInitialStatus = async () => {
    const url = `/api/status`;
    try {
        const res = await fetch(url, {
            method: 'get',
            mode: 'cors',
        });

        const data = await res.json();

        console.log(data)
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

export { getInitialStatus };