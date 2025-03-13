import React, { useState } from "react";

const LogicalOperator = ({updateOperatorsData,id})=>{
    const valueRef = React.createRef();
    const handleChange = () =>{
        updateOperatorsData(id,valueRef.current.value)
    }
    return(
        <div className="operator-container">
            <label className="filter-label">logical operator:</label>
            <select className="operator-dropdown" ref={valueRef} onChange={handleChange}>
                <option value="" disabled>Choose an operator</option>
                <option value="and">$and</option>
                <option value="or">$or</option>
            </select>
        </div>
    )
}

export default LogicalOperator