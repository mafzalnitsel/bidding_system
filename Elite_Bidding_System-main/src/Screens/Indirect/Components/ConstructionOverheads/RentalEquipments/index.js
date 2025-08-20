import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import rentalEquipmentsTableData from './rentalEquipmentsTableData';
import './index.css';
import { CustomSelect } from '../../../../../Utils';

const RentalEquipments = () => {
    const unitOptions = [
        { label: 'CUM', value: 'CUM' },
        { label: 'SQM', value: 'SQM' },
        { label: 'Unit', value: 'Unit' },
    ];

    const Style = { CustomSelect, control: () => ({ ...CustomSelect.control(), backgroundColor: "transparent", borderWidth: "0" }) }


    const defaultTableData = [
        {
            group: '',
            description: '',
            unit: 'Unit',
            matlQty: 0,
            machOutput: '',
            days: 0,
            mcm: 0,
            mcNos: 1,
            months: 0,
            polHr: 0,
            polRate: 0,
            rentMonth: 0,
            groupTotal: 0,
            perUnit: 0,
            subItems: [],
        },
    ];

    const [tableData, setTableData] = useState(defaultTableData);

    useEffect(() => {
        if (rentalEquipmentsTableData && rentalEquipmentsTableData.length > 0) {
            setTableData(
                rentalEquipmentsTableData.map((group) => ({
                    ...defaultTableData[0], // Ensure all fields exist
                    ...group,
                    subItems: group.subItems || [],
                    total: calculateGroupTotal(group),
                    perUnit: calculatePerUnit(calculateGroupTotal(group), group.matlQty),
                }))
            );
        }
    }, [rentalEquipmentsTableData]);

    const [headerData, setHeaderData] = useState({
        quotationNo: '',
        clientName: '',
        contractType: '',
        constructionPeriod: '',
        furnishedMaterial: [],
        escalation: null,
        siteOverheads: '',
        receivedDate: '',
        submissionDate: '',
        profit: '',
        pst: null,
        incomeTax: '7',
        projectLocation: '',
    });


    const getValueFromInput = (e) => {
        const { name, value } = e.target;
        setHeaderData((prev) => ({ ...prev, [name]: value }));
    };

    const getValueFromSelect = (selectedOption, name) => {
        setHeaderData((prev) => ({ ...prev, [name]: selectedOption }));
    };


    const handleTableInputChange = (e, groupIndex, field, subItemIndex = null) => {
        const value = e.target.value;
        // Allow only numeric values for specific fields
        const numericFields = ['matlQty', 'days', 'mcm', 'mcNos', 'months', 'polHr', 'polRate', 'rentMonth'];
        if (numericFields.includes(field) && value !== '' && isNaN(value)) {
            return; // Ignore non-numeric input
        }

        setTableData((prev) => {
            const newData = [...prev];
            if (subItemIndex === null) {
                newData[groupIndex] = { ...newData[groupIndex], [field]: value };
                newData[groupIndex].groupTotal = calculateGroupTotal(newData[groupIndex]);
                newData[groupIndex].perUnit = calculatePerUnit(
                    newData[groupIndex].groupTotal,
                    newData[groupIndex].matlQty
                );
            } else {
                newData[groupIndex].subItems = newData[groupIndex].subItems || [];
                newData[groupIndex].subItems[subItemIndex] = {
                    ...newData[groupIndex].subItems[subItemIndex],
                    [field]: value,
                };
                newData[groupIndex].subItems[subItemIndex].total = calculateSubItemTotal(
                    newData[groupIndex].subItems[subItemIndex]
                );
                newData[groupIndex].groupTotal = calculateGroupTotal(newData[groupIndex]);
                newData[groupIndex].perUnit = calculatePerUnit(
                    newData[groupIndex].groupTotal,
                    newData[groupIndex].matlQty
                );
            }
            return newData;
        });
    };

    const handleTableSelectChange = (selectedOption, groupIndex, field, subItemIndex = null) => {
        const value = selectedOption ? selectedOption.value : '';
        setTableData((prev) => {
            const newData = [...prev];
            if (subItemIndex === null) {
                newData[groupIndex] = { ...newData[groupIndex], [field]: value };
                newData[groupIndex].groupTotal = calculateGroupTotal(newData[groupIndex]);
                newData[groupIndex].perUnit = calculatePerUnit(
                    newData[groupIndex].groupTotal,
                    newData[groupIndex].matlQty
                );
            } else {
                newData[groupIndex].subItems[subItemIndex] = {
                    ...newData[groupIndex].subItems[subItemIndex],
                    [field]: value,
                };
                newData[groupIndex].subItems[subItemIndex].total = calculateSubItemTotal(
                    newData[groupIndex].subItems[subItemIndex]
                );
                newData[groupIndex].groupTotal = calculateGroupTotal(newData[groupIndex]);
                newData[groupIndex].perUnit = calculatePerUnit(
                    newData[groupIndex].groupTotal,
                    newData[groupIndex].matlQty
                );
            }
            return newData;
        });
    };

    const calculateSubItemTotal = (subItem) => {
        const months = parseFloat(subItem.months) || 0;
        const rentMonth = parseFloat(subItem.rentMonth) || 0;
        const polHr = parseFloat(subItem.polHr) || 0;
        const polRate = parseFloat(subItem.polRate) || 0;
        const nos = parseFloat(subItem.nos) || 1;
        const hoursPerMonth = 26 * 8; // 208 hours
        return Number(
            ((rentMonth * months + polHr * polRate * hoursPerMonth * months) * nos).toFixed(2)
        );
    };

    const calculateGroupTotal = (group) => {
        const groupRentTotal = (parseFloat(group.rentMonth) || 0) * (parseFloat(group.months) || 0);
        const subItemsTotal = Array.isArray(group.subItems)
            ? group.subItems.reduce((sum, item) => sum + (calculateSubItemTotal(item) || 0), 0)
            : 0;
        return Number((groupRentTotal + subItemsTotal).toFixed(2));
    };

    const calculatePerUnit = (total, matlQty) => {
        const qty = parseFloat(matlQty) || 1; // Avoid division by zero
        return Number((parseFloat(total) / qty).toFixed(2));
    };

    const calculateDocTotal = () => {
        return tableData
            .reduce((sum, item) => sum + (parseFloat(item.groupTotal) || 0), 0)
            .toFixed(2);
    };

    useEffect(() => {
        setTableData(rentalEquipmentsTableData)
    }, [rentalEquipmentsTableData])


    return (
        <div className="main-container">
            <h1 className="main-heading">Rental Equipments</h1>
            <div className="form-container">
                <div className="form-column">
                    <div className="form-group">
                        <label>Quotation No</label>
                        <input type="text" readOnly className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Client Name</label>
                        <input
                            name="clientName"
                            type="text"
                            onChange={getValueFromInput}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Contract Type</label>
                        <input
                            name="contractType"
                            type="text"
                            onChange={getValueFromInput}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Construction Period</label>
                        <input
                            name="constructionPeriod"
                            type="text"
                            onChange={getValueFromInput}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Owner Furnished Material</label>
                        <Select
                            name="furnishedMaterial"
                            isMulti
                            options={[
                                { label: 'Cement', value: 'C' },
                                { label: 'Steel', value: 'S' },
                                { label: 'Other', value: 'O' },
                            ]}
                            onChange={(selected) => getValueFromSelect(selected, 'furnishedMaterial')}
                            styles={CustomSelect}
                        />
                    </div>
                    <div className="form-group">
                        <label>Escalation</label>
                        <Select
                            name="escalation"
                            options={[
                                { label: 'Rebar', value: 'Rebar' },
                                { label: 'Cement', value: 'Cement' },
                                { label: 'Diesel', value: 'Diesel' },
                                { label: 'Petrol', value: 'Petrol' },
                                { label: 'Labour', value: 'Labour' },
                                { label: 'Masan', value: 'Masan' },
                            ]}
                            onChange={(selected) => getValueFromSelect(selected, 'escalation')}
                            styles={CustomSelect}
                        />
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-group">
                        <label>Received Date</label>
                        <input
                            name="receivedDate"
                            type="date"
                            onChange={getValueFromInput}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Submission Date</label>
                        <input
                            name="submissionDate"
                            type="date"
                            onChange={getValueFromInput}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Profit</label>
                        <input
                            name="profit"
                            type="text"
                            onChange={getValueFromInput}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>PST</label>
                        <Select
                            name="pst"
                            options={[
                                { label: 'Sindh 13%', value: 13 },
                                { label: 'KPK 15%', value: 15 },
                                { label: 'Punjab 16%', value: 16 },
                                { label: 'Balochistan 15%', value: 15 },
                            ]}
                            onChange={(selected) => getValueFromSelect(selected, 'pst')}
                            styles={CustomSelect}
                        />
                    </div>
                    <div className="form-group">
                        <label>Income Tax</label>
                        <input
                            name="incomeTax"
                            type="text"
                            value={headerData.incomeTax}
                            readOnly
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Total</label>
                        <input
                            type="text"
                            value={calculateDocTotal()}
                            readOnly
                            className="form-input text-right"
                        />
                    </div>
                </div>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead className='form-header'>
                        <tr>
                            <th>Group</th>
                            <th>Description</th>
                            <th>Unit</th>
                            <th>Matl. Qty</th>
                            <th>Mach. Output</th>
                            <th>Days</th>
                            <th>MCM</th>
                            <th>MC.Nos</th>
                            <th>Months</th>
                            <th>POL/Hr</th>
                            <th>POL Rate (Rs/Ltr)</th>
                            <th>Rent/Month (Rs)</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData?.map((group, index) => (
                            <React.Fragment key={index}>
                                <tr className="group-row">
                                    <td>
                                        <input
                                            type="text"
                                            value={group.group}
                                            onChange={(e) => handleTableInputChange(e, index, 'group')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={group.description}
                                            onChange={(e) => handleTableInputChange(e, index, 'description')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <Select
                                            value={unitOptions.find((option) => option.value === group.unit)}
                                            options={unitOptions}
                                            onChange={(selected) => handleTableSelectChange(selected, index, 'unit')}
                                            styles={Style}
                                            className="table-select"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.matlQty}
                                            onChange={(e) => handleTableInputChange(e, index, 'matlQty')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={group.machOutput}
                                            onChange={(e) => handleTableInputChange(e, index, 'machOutput')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.days}
                                            onChange={(e) => handleTableInputChange(e, index, 'days')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.mcm}
                                            onChange={(e) => handleTableInputChange(e, index, 'mcm')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.mcNos}
                                            onChange={(e) => handleTableInputChange(e, index, 'mcNos')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.months}
                                            onChange={(e) => handleTableInputChange(e, index, 'months')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.polHr}
                                            onChange={(e) => handleTableInputChange(e, index, 'polHr')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.polRate}
                                            onChange={(e) => handleTableInputChange(e, index, 'polRate')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={group.rentMonth}
                                            onChange={(e) => handleTableInputChange(e, index, 'rentMonth')}
                                            className="table-input"
                                        />
                                    </td>
                                    <td>{group.groupTotal?.toLocaleString()}</td>
                                </tr>
                                {group.subItems?.map((item, subIndex) => (
                                    <tr key={`${index}-${subIndex}`} className="subitem-row">
                                        <td></td>
                                        <td>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleTableInputChange(e, index, 'description', subIndex)}
                                                className="table-input"
                                            />
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.mcm}
                                                onChange={(e) => handleTableInputChange(e, index, 'mcm', subIndex)}
                                                className="table-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.nos}
                                                onChange={(e) => handleTableInputChange(e, index, 'nos', subIndex)}
                                                className="table-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.months}
                                                onChange={(e) => handleTableInputChange(e, index, 'months', subIndex)}
                                                className="table-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.polHr}
                                                onChange={(e) => handleTableInputChange(e, index, 'polHr', subIndex)}
                                                className="table-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.polRate}
                                                onChange={(e) => handleTableInputChange(e, index, 'polRate', subIndex)}
                                                className="table-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.rentMonth}
                                                onChange={(e) => handleTableInputChange(e, index, 'rentMonth', subIndex)}
                                                className="table-input"
                                            />
                                        </td>
                                        <td>{item.total?.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td colSpan={12} className="font-bold">
                                        Total
                                    </td>
                                    <td className="font-bold">{group.groupTotal?.toLocaleString()}</td>
                                </tr>
                                <tr className="per-unit-row form-footer">
                                    <td colSpan={12} className="font-bold">
                                        Per Unit
                                    </td>
                                    <td className="font-bold">{group.perUnit}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RentalEquipments;