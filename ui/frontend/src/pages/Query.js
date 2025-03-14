import React, { useState } from "react";
import Filter  from "../components/Filter";
import LogicalOperator from "../components/LogicalOperator";
import Update from "../components/Update";
import "../styles/Query.css"
// const dbClient = new NoSQLDBClient("https://TheAPIUrl:Port");
// const registerData = {
//     username: "newuser@example.com",
//     password: "newpassword",
// };

const Query = (props) => {
    const [attributes] = useState(["engine", "model", "numberOfDoors", "year"])
    const [mockDB,setMockDb] = useState( [
        {
            "name": "Cars",
            "collections": [
                {
                    "name": "Audi",
                    "documents": [
                        { "model": "A3", "doors": 5, "body_type": "sedan" },
                        { "model": "A4", "doors": 5, "body_type": "sedan" },
                        { "model": "A6", "doors": 5, "body_type": "sedan" },
                        { "model": "Q2", "doors": 5, "body_type": "hatchback" },
                        { "model": "Q5", "doors": 5, "body_type": "SUV" },
                        { "model": "Q7", "doors": 5, "body_type": "SUV" },
                        { "model": "R8", "doors": 2, "body_type": "coupe" },
                        { "model": "e-tron", "doors": 5, "body_type": "electric SUV" }
                    ]
                },
                {
                    "name": "BMW",
                    "documents": [
                        { "model": "Z4", "doors": 2, "body_type": "roadster" },
                        { "model": "M3", "doors": 4, "body_type": "sedan" },
                        { "model": "M4", "doors": 2, "body_type": "coupe" },
                        { "model": "X1", "doors": 5, "body_type": "SUV" },
                        { "model": "X3", "doors": 5, "body_type": "SUV" },
                        { "model": "X5", "doors": 5, "body_type": "SUV" },
                        { "model": "i4", "doors": 4, "body_type": "electric sedan" },
                        { "model": "iX", "doors": 5, "body_type": "electric SUV" }
                    ]
                },
                {
                    "name": "Mercedes",
                    "documents": [
                        { "model": "C200", "doors": 4, "body_type": "sedan" },
                        { "model": "E63", "doors": 4, "body_type": "sedan" },
                        { "model": "S63", "doors": 4, "body_type": "luxury sedan" },
                        { "model": "GLA 45", "doors": 5, "body_type": "SUV" },
                        { "model": "GLC", "doors": 5, "body_type": "SUV" },
                        { "model": "GLE 63", "doors": 5, "body_type": "SUV" },
                        { "model": "AMG GT", "doors": 2, "body_type": "coupe" },
                        { "model": "EQB", "doors": 5, "body_type": "electric SUV" }
                    ]
                },
                {
                    "name": "Tesla",
                    "documents": [
                        { "model": "Model S", "doors": 4, "body_type": "sedan" },
                        { "model": "Model 3", "doors": 4, "body_type": "sedan" },
                        { "model": "Model X", "doors": 5, "body_type": "SUV" },
                        { "model": "Model Y", "doors": 5, "body_type": "SUV" },
                        { "model": "Roadster", "doors": 2, "body_type": "sports" },
                        { "model": "Cybertruck", "doors": 4, "body_type": "truck" }
                    ]
                }
            ]
        },
        {
            "name": "Property Listing",
            "collections":[
                {
                    "name":"properties",
                    "documents": [
                        {
                            "_id": 1,
                            "title": "Luxury Apartment in Downtown",
                            "type": "Apartment",
                            "price": 350000,
                            "location": {
                                "city": "New York",
                                "state": "NY",
                                "zipcode": "10001"
                            },
                            "bedrooms": 2,
                            "bathrooms": 2,
                            "size_sqft": 1200,
                            "listed_date": "2024-03-01",
                            "status": "Available",
                            "agent_id": 201
                        },
                        {
                            "_id": 2,
                            "title": "Cozy Suburban House",
                            "type": "House",
                            "price": 450000,
                            "location": {
                                "city": "Los Angeles",
                                "state": "CA",
                                "zipcode": "90045"
                            },
                            "bedrooms": 3,
                            "bathrooms": 2,
                            "size_sqft": 1800,
                            "listed_date": "2024-02-15",
                            "status": "Under Contract",
                            "agent_id": 202
                        }
                    ]
                },
                {
                    "name":"agents",
                    "documents": [
                        {
                            "_id": 201,
                            "name": "John Realtor",
                            "phone": "555-1234",
                            "email": "john.realtor@example.com",
                            "agency": "Dream Homes Realty"
                        },
                        {
                            "_id": 202,
                            "name": "Jane Property",
                            "phone": "555-5678",
                            "email": "jane.property@example.com",
                            "agency": "Luxury Living Realtors"
                        }
                    ]
                },
                {
                    name:"customers",
                    documents: [
                        {
                            "_id": 301,
                            "name": "Alice Buyer",
                            "phone": "555-7890",
                            "email": "alice.buyer@example.com",
                            "interested_properties": [1, 2]
                        },
                        {
                            "_id": 302,
                            "name": "Bob Investor",
                            "phone": "555-2468",
                            "email": "bob.investor@example.com",
                            "interested_properties": [2]
                        }
                    ]
                }
            ]
        }

    ])
    
    const [dbName, setDBName] = useState("")
    const [colName, setColName] = useState("")

    
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
        setDBName("");
        setColName("");
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
            if (optionNameRef.current)
                optionNameRef.current.value = ""
            if(createOptionsRef.current.value === "collection") {
                setDatabaseDropdownState(true)
                setOptionNameState(false)
            }
            else{
                setDatabaseDropdownState(false)
                setOptionNameState(true)

            }
            setColletionDropdownState(false)
            setFilterState(false)
            setJSONInputState(false)
            setSaveButtonState(false)
        }
    }

    const onOptionsNameChange = () =>{
        if (createOptionsRef.current.value.trim() != "") {
            // setDatabaseDropdownState(false)
            // setColletionDropdownState(false)
            setFilterState(false)
            setUpdateState(false);
            setJSONInputState(false)
            setSaveButtonState(true)
        }
    }

    const onDatabaseNameChange = () =>{
        setColName("");
        if (databaseNameRef.current.value.trim() != ""){            
            setDBName(databaseNameRef.current.value.trim())
            if(queryCommandRef.current.value != "create")
                setColletionDropdownState(true);
            else{
                setOptionNameState(true)
                setColletionDropdownState(false);
                setSaveButtonState(false)
            }
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
        if (collectionNameRef.current.value.trim() != ""){
            setColName(collectionNameRef.current.value)
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
        // console.log(mockDB.find(db => db.name.toLowerCase() === dbName).collections.find(col => col.name.toLowerCase() === colName).documents);
        console.log("mockDB initial");
        console.log(mockDB);
        switch (queryCommandRef.current.value.trim()) {
            
            case "create":{
                if(createOptionsRef.current.value === "database"){
                    // dbClient.createDatabase({ dbName: optionNameRef.current.value})
                    // .then(result => {
                    //     console.log("Database created:", result);
                    // })

                    if(!mockDB.find(db => db.name.toLowerCase() === optionNameRef.current.value)){
                        console.log("the db does not exist")
                        mockDB.push({name:optionNameRef.current.value})
                        optionNameRef.current.value = ""
                        console.log("optionNameRef.current.value")
                        console.log(optionNameRef.current.value)
                    }

                }
                else {
                    // dbClient.createCollection({dbName: optionNameRef.current.value })
                    // .then(result => {
                    //     console.log("collection created:", result);
                    // })

                    if(!mockDB.find(db => db.name.toLowerCase() === optionNameRef.current.value)) {
                        console.log("the db does not exist")
                        let database = mockDB.find(database => database.name.toLowerCase() === dbName);
                        if(database){
                            if(database.collections){
                                database.collections.push({ name: optionNameRef.current.value });
                            }
                            else{
                                database.collections = [{ name: optionNameRef.current.value }];
                            }
                        }
                    }
                }
                break;
            }
            case "insert":{
                // const createDocData = {
                //     dbName: databaseNameRef.current.value,
                //     collectionName: collectionNameRef.current.value,
                //     document: jsonDataRef.current.value,
                //     token: "your-auth-token"
                // };

                // dbClient.createDocument(createDocData)
                // .then(result => {
                //     console.log("Document created:", result);
                // })
                // .catch(err => {
                //     console.error("Failed to create document:", err);
                // });
                mockDB.find(db => db.name.toLowerCase() === dbName).collections.find(col => col.name.toLowerCase() === colName).documents?
                    mockDB.find(db => db.name.toLowerCase() === dbName).collections.find(col => col.name.toLowerCase() === colName).documents.push(JSON.parse(jsonDataRef.current.value))
                : mockDB.find(db => db.name.toLowerCase() === dbName).collections.find(col => col.name.toLowerCase() === colName).documents = [JSON.parse(jsonDataRef.current.value)]
                alert("Added Successfully!")
                break;
            }
            
            case "delete":{
                if(colName === ""){
                    var dbCopy = mockDB;

                    
                    setMockDb((mockDB.filter(db => db.name.toLowerCase() !== dbName)))
                    alert(dbName+ " deleted successfully")
                    
                    if(queryCommandRef.current)
                        queryCommandRef.current.value = ""

                    if (databaseNameRef.current)
                        databaseNameRef.current.value = ""    

                    if (collectionNameRef.current)
                        collectionNameRef.current.value = ""

                    

                }
                else{
                    if(filters.length === 0){
                        let database = mockDB.find(database => database.name.toLowerCase() === dbName);

                        if (database) {
                            // Filter out the collection with the specified name
                            database.collections = database.collections.filter(collection => collection.name.toLowerCase() !== colName);
                            if (queryCommandRef.current)
                                queryCommandRef.current.value = ""
                            
                            if (databaseNameRef.current)
                                databaseNameRef.current.value = ""
                            
                            if (collectionNameRef.current)
                                collectionNameRef.current.value = ""
                            alert(colName+" deleted successfully")
                        }
                        
                    }
                }
            }

            // case "update":{
            //     const createDocData = {
            //         dbName: databaseNameRef.current.value,
            //         collectionName: collectionNameRef.current.value,
            //         document: jsonDataRef.current.value,
            //         token: "your-auth-token"
            //     };

            //     dbClient.createDocument(createDocData)
            //     .then(result => {
            //         console.log("Document created:", result);
            //     })
            //     .catch(err => {
            //         console.error("Failed to create document:", err);
            //     });
            // }

        }

        setDBName("");
        setColName("");
        setDatabaseDropdownState(false);
        setOptionNameState(false);
        setColletionDropdownState(false);
        setFilterState(false);
        setUpdateState(false);
        setJSONInputState(false);
        setSaveButtonState(false)
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
                        {
                            mockDB.map(db=>{
                                return <option value={`${db.name.toLowerCase()}`}>{db.name}</option>
                            })
                        }
                        
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
                            {console.log("collections of the curr db " +dbName, mockDB.find(db => db.name.toLowerCase() == dbName))}
                        {    
                            
                                mockDB.find(db => db.name.toLowerCase() == dbName).collections?
                                mockDB.find(db => db.name.toLowerCase() == dbName).collections.map(col=>{
                                    return <option value={col.name.toLowerCase()}>{col.name}</option>
                                })
                                :null
                        }
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
                        <div id="json-input-container">
                            <textarea id="json-input" cols={80} rows={15} ref={jsonDataRef} onChange={validateJSONInput}></textarea>
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

