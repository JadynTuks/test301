import React, { useState } from "react";
import  Filter  from "../components/Filter";
import LogicalOperator from "../components/LogicalOperator";
import Update from "../components/Update";
// const dbClient = new NoSQLDBClient("https://TheAPIUrl:Port");
// const registerData = {
//     username: "newuser@example.com",
//     password: "newpassword",
// };

const Query = (props) => {
    const [attributes] = useState(["engine", "model", "numberOfDoors", "year"])

    
    const [filters,setFilters] = useState([])
    const [filterData,setFilterData] = useState({})
    const [logicalOperators,setOperators] = useState([])
    const [logicalOpsValues,setOperatorsData] = useState([])
    const [updates, setUpdates] = useState([])
    const [updateData, setUpdateData] = useState({})

    const [createOptionsState, setCreateOptionsState] = useState(false); //used to display or hide the dropdown with options on what to create when the create command is sleceted
    const [optionsNameState, setOptionNameState] = useState(false); //used to display or hide the text which requires the name of the nelwy created collection or database
    const [databaseDropdownState, setDatabaseDropdownState] = useState(false); //used to hide or display the dropdown with database names as options
    const [colletionDropdownState, setColletionDropdownState] = useState(false); //used to hide or display the dropdown with collection names as option
    const [filterState, setFilterState] = useState(false); //used to display or hide the filters section
    const [updateState, setUpdateState] = useState(false); //used to display or hide the filters section
    const [JSONInputState, setJSONInputState] = useState(false); //used to display or hide the JSON data input
    const [saveButtonState, setSaveButtonState] = useState(false); //used to display or hide the save button

    const queryCommandRef = React.createRef(); //references the command dropdown
    const createOptionsRef = React.createRef(); //references the "what to create" dropdown, which the user uses to choose whether to create a databaseor collection
    const optionNameRef = React.createRef(); //references the input fied used to provide the name of the new database/collection being created
    const databaseNameRef = React.createRef(); //references the database names dropdown
    const collectionNameRef = React.createRef(); //references the collection names dropdown
    const jsonDataRef = React.createRef(); //references the input field for JSON data

    const onCommandChange =()=>{ //
        setDatabaseDropdownState(false);
        setOptionNameState(false);
        setColletionDropdownState(false);
        setFilterState(false);
        setUpdateState(false);
        setJSONInputState(false);
        setSaveButtonState(false)
        switch (queryCommandRef.current.value.trim()) {
            case "create": {
                setCreateOptionsState(true);
                if (createOptionsRef.current)
                    createOptionsRef.current.value = ""
                console.log("Heree in command create");
                
                break;
            }
            
            case "insert":
            case "delete": {
                setCreateOptionsState(false);
                setOptionNameState(false)
                setDatabaseDropdownState(true);
                if (databaseNameRef.current)
                    databaseNameRef.current.value = ""
                
                break;
            }
            case "update":{
                setDatabaseDropdownState(true);
                if (databaseNameRef.current)
                    databaseNameRef.current.value = ""
            }
                
            default:
                break;
        }
        
    }
    
    const onCreateOptionsChange = () =>{
        if (createOptionsRef.current.value.trim()!= ""){
            setOptionNameState(true)
            if (optionNameRef.current)
                optionNameRef.current.value = ""
            setDatabaseDropdownState(false)
            setColletionDropdownState(false)
            setFilterState(false)
            setJSONInputState(false)
            setSaveButtonState(false)
        }
    }

    const onOptionsNameChange = () =>{
        if (createOptionsRef.current.value.trim() != "") {
            setDatabaseDropdownState(false)
            setColletionDropdownState(false)
            setFilterState(false)
            setUpdateState(false);
            setJSONInputState(false)
            setSaveButtonState(true)
        }
    }

    const onDatabaseNameChange = () =>{
        if (databaseNameRef.current.value.trim() != ""){
            setColletionDropdownState(true);
            if (collectionNameRef.current)
                collectionNameRef.current.value = ""
            setFilterState(false);
            setJSONInputState(false);
            if(queryCommandRef.current.value.trim() == "delete"){
                setSaveButtonState(true)
            }
        }
        else{
            setOptionNameState(false)
            setColletionDropdownState(false);
            setFilterState(false);
            setUpdateState(false);
            setJSONInputState(false);
            setSaveButtonState(false)
        }
    }
    
    const onCollectionNameChange = () =>{
        if (databaseNameRef.current.value.trim() != ""){
            if (queryCommandRef.current.value.trim() != "create" && queryCommandRef.current.value.trim()!="insert"){
                setFilterState(true);
                setFilters([])
                setFilterData({})
                setOperators([])
                setOperatorsData([])
            }

            if (queryCommandRef.current.value.trim() == "insert"){
                setJSONInputState(true);
                if (jsonDataRef.current)
                    jsonDataRef.current.value = ""
            }

            if(queryCommandRef.current.value.trim() == "delete"){
                setSaveButtonState(true);
            }

            if(queryCommandRef.current.value.trim() == "update"){
                setUpdateState(true);
                // setSaveButtonState(true);
            }
            
        }
        else{
            setFilterState(false);
            setJSONInputState(false);
        }
    }

    const validateJSONInput = () =>{
        try{
            JSON.parse(jsonDataRef.current.value.trim())
            setSaveButtonState(true);
        }
        catch(e){
            setSaveButtonState(false);
        }
    }

    const updateFilterData = (id,data) =>{
        setFilterData(prevState=>({...prevState,[id]:data}))
    }
    
    const updateUPDATEData = (id,data) =>{
        setUpdateData(prevState=>({...prevState,[id]:data}))
    }
    
    const updateOperatorsData = (id,data) =>{
        setOperatorsData(prevState=>({...prevState,[id]:data}))
    }

    const addFilter=()=>{
        var id = Date.now()
        if(filters.length != 0){ //if it is the first filter, do not include the logical operator dropdown
            setOperators([...logicalOperators, <LogicalOperator key={id} updateOperatorsData={updateOperatorsData} id={logicalOperators.length} />]);
        }
        setFilters([...filters,<Filter attributes={attributes} key={id} updateFilterData={updateFilterData} id={filters.length}/>]);
    }
    
    const addUpdate=()=>{
        var id = Date.now()
        setUpdates([...updates,<Update attributes={attributes} key={id} updateUPDATEData={updateUPDATEData} id={updates.length}/>]);
    }

    const handleSave = () =>{
        
        // switch (queryCommandRef.current.value.trim()) {
        //     case "create":{
        //         if(createOptionsRef.current.value === "database"){
        //             // dbClient.createDatabase({ dbName: optionNameRef.current.value})
        //             // .then(result => {
        //             //     console.log("Database created:", result);
        //             // })
        //         }
        //         else {
        //             // dbClient.createCollection({dbName: optionNameRef.current.value })
        //             // .then(result => {
        //             //     console.log("collection created:", result);
        //             // })
        //         }
        //         break;
        //     }
        //     case "insert":{
        //         const createDocData = {
        //             dbName: databaseNameRef.current.value,
        //             collectionName: collectionNameRef.current.value,
        //             document: jsonDataRef.current.value,
        //             token: "your-auth-token"
        //         };

        //         dbClient.createDocument(createDocData)
        //         .then(result => {
        //             console.log("Document created:", result);
        //         })
        //         .catch(err => {
        //             console.error("Failed to create document:", err);
        //         });
        //     }
            
        //     case "update":{
        //         const createDocData = {
        //             dbName: databaseNameRef.current.value,
        //             collectionName: collectionNameRef.current.value,
        //             document: jsonDataRef.current.value,
        //             token: "your-auth-token"
        //         };

        //         dbClient.createDocument(createDocData)
        //         .then(result => {
        //             console.log("Document created:", result);
        //         })
        //         .catch(err => {
        //             console.error("Failed to create document:", err);
        //         });
        //     }

        //     case "update":{
        //         const createDocData = {
        //             dbName: databaseNameRef.current.value,
        //             collectionName: collectionNameRef.current.value,
        //             document: jsonDataRef.current.value,
        //             token: "your-auth-token"
        //         };

        //         dbClient.createDocument(createDocData)
        //         .then(result => {
        //             console.log("Document created:", result);
        //         })
        //         .catch(err => {
        //             console.error("Failed to create document:", err);
        //         });
        //     }

        // }
    }
    


    return (
        <>
            <center id="page-heading">Query</center>

            <div className="query-section">
                <label className="section-label">Select a query:</label>
                <select id="query-dropdown" className="dropdown" defaultValue="" ref={queryCommandRef} onChange={onCommandChange}>
                    <option value="" disabled>Choose a query</option>
                    <option value="create">Create</option>
                    <option value="insert">Insert</option>
                    <option value="delete">Delete</option>
                    <option value="update">Update</option>
                </select>
            </div>

            {
                createOptionsState?
                <div className="query-section">
                        <label className="section-label">Create a new:</label>
                    <select id="create-options-dropdown" className="dropdown" defaultValue="" ref={createOptionsRef} onChange={onCreateOptionsChange}>
                            <option value="" disabled>Choose what to create</option>
                            <option value="database">Database</option>
                            <option value="collection">Collection</option>
                        </select>
                </div>
                :null
            }
        
            {
                databaseDropdownState?
                <div className="query-section">
                    <label className="section-label" >Select a database:</label>
                    <select id="database-dropdown" className="dropdown" defaultValue="" ref={databaseNameRef} onChange={onDatabaseNameChange}>
                        <option value="" disabled>Choose a database</option>
                        <option value="cars">Cars</option>
                    </select>
                </div>
                :null
            }


            {
                optionsNameState?
                <div className="query-section">
                    <label className="section-label">{`Name:`}</label>
                    <input id="create-value" className="dropdown" type="text" placeholder="Enter the name of the new item" ref={optionNameRef} onChange={onOptionsNameChange}/>
                </div>
                :null
            }

            {
                colletionDropdownState?
                <div className="query-section">
                    <label className="section-label">Select a collection:</label>
                    <select id="colletion-dropdown" className="dropdown" defaultValue="" ref={collectionNameRef} onChange={onCollectionNameChange}>
                        <option value="" disabled>Choose a collection</option>
                        <option value="audi">Audi</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="bmw">BMW</option>
                    </select>
                </div>
                :null
            }
            
            {
                filterState?
                <div className="query-section">
                    <label className="section-label">Filter:</label>

                    <div id="filters-section">
                        {
                            filters.map((filter,ind)=>{
                                console.log(filter);
                                if(ind == 0){
                                    return filter
                                }
                                                            
                                return(
                                    <>
                                        {logicalOperators[ind-1]}
                                        {filter}
                                    </>
                                )
                            })
                                
                        }
                            
                        <button id="add-filter-button" onClick={addFilter}>+</button>

                    </div>

                </div>
                :null
            }
            
            {
                updateState?
                <div className="query-section">
                    <label className="section-label">Update:</label>

                    <div id="filters-section">
                        {
                            updates.map(update=>{
                                return update
                            })
                                
                        }
                            
                        <button id="add-filter-button" onClick={addUpdate}>+</button>

                    </div>

                </div>
                :null
            }

            {
                JSONInputState?
                <div id="json-data-wrapper" className="query-section">
                    <center>
                        <h4>Write JSON data to add to the collection</h4>
                        <div>
                            <textarea cols={80} rows={15} ref={jsonDataRef} onChange={validateJSONInput}></textarea>
                        </div>
                    </center>
                </div>
                :null
            }
            {
                saveButtonState?
                <center><button id="save-button" onClick={handleSave} disabled={!saveButtonState}>Save</button></center>
                :null
            }
        </>
    );
};

export default Query;
