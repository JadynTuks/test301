import React, { useRef } from "react";

const Filter = ({ attributes, updateFilterData, id }) => {

    const attributeRef= React.createRef()
    const operatorRef= React.createRef()
    const valueRef= React.createRef()
    const handleChange = () =>{
        var data={
            attribute:attributeRef.current.value,
            operator:operatorRef.current.value,
            value:valueRef.current.value,
        }

        updateFilterData(id,data);

    }

    return (
        <div className="filter">
            <div className="filter-container">
                <label className="filter-label">Attribute:</label>
                <select className="filter-dropdown attribute" defaultValue="" ref={attributeRef} onChange={handleChange}>
                    <option value="" disabled>
                        Type or choose attribute
                    </option>
                    {
                        attributes.map((val, ind) => (
                            <option key={ind} value={val}>
                                {val}
                            </option>
                        ))
                    }
                </select>
            </div>

            <div className="filter-container">
                <label className="filter-label">Operator:</label>
                <select className="filter-dropdown operator" defaultValue="" ref={operatorRef} onChange={handleChange}>
                    <option value="" disabled>
                        Choose an operator
                    </option>
                    <option value=">">greater than "{">"}"</option>
                    <option value="<">smaller than "{"<"}"</option>
                    <option value="=">equal to "{"="}"</option>
                    <option value=">=">greater than or equal to "{"≥"}"</option>
                    <option value="<=">smaller than or equal to "{"≤"}"</option>
                </select>
            </div>

            <div className="filter-container">
                <label className="filter-label">Value:</label>
                <input className="filter-dropdown" type="text" placeholder="value" ref={valueRef} onChange={handleChange} />
            </div>
        </div>
    );
};

export default Filter;
