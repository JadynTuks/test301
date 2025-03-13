import React, { useRef } from "react";

const Update = ({ attributes, updateUPDATEData, id }) => {

    const attributeRef= React.createRef()
    const operatorRef= React.createRef()
    const valueRef= React.createRef()
    const handleChange = () =>{
        var data={
            attribute:attributeRef.current.value,
            operator:operatorRef.current.value,
            value:valueRef.current.value,
        }

        updateUPDATEData(id,data);

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
                    <option value="=">equal to</option>
                    <option value="++">increment by</option>
                    <option value="--">decrement by</option>
                </select>
            </div>

            <div className="filter-container">
                <label className="filter-label">Value:</label>
                <input className="filter-dropdown" type="text" placeholder="value" ref={valueRef} onChange={handleChange} />
            </div>
        </div>
    );
};

export default Update;
