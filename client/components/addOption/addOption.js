const AddOption = ({ handleInputChange, handleSend, option }) => {
    return (
        <>
            <input type="text" value={option} onChange={handleInputChange} placeholder="Enter new option" />
            <button onClick={handleSend}>Add Option</button>
        </>
    )
}

export default AddOption;