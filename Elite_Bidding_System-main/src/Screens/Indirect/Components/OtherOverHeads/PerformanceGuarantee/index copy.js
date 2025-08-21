import React, { useState } from "react";

const toNumber = (val, fallback = 0) => {
    const num = parseFloat(val);
    return isNaN(num) ? fallback : num;
};

const PerformanceGuarantee = () => {
    const [bankRows, setBankRows] = useState([
        {
            source: "Bank",
            customerName: "Riko Dik Project",
            projectValue: 1750000000,
            guaranteePercent: 10,
            years: 2.5,
            totalQuarters: 12, // years * 4 but editable
            bankCommissionRate: 0.01,
            kibor: 11,
            excessKibor: 2,
        },
    ]);

    const [insuranceRows, setInsuranceRows] = useState([
        {
            source: "Insurance Company",
            customerName: "Riko Dik Project",
            projectValue: 4000000000,
            guaranteePercent: 10,
            years: 1,
            totalQuarters: 4, // years * 4 but editable
            bankCommissionRate: 0.02,
            kibor: 11,
            excessKibor: 2,
        },
    ]);

    // --- Calculations ---
    const calculateGuaranteeValue = (row) =>
        (toNumber(row.projectValue) * toNumber(row.guaranteePercent)) / 100;

    const calculateTotalRate = (row) =>
        toNumber(row.kibor) + toNumber(row.excessKibor);

    const calculateCommission = (row) =>
        calculateGuaranteeValue(row) *
        toNumber(row.bankCommissionRate) *
        (toNumber(row.years) || 1);

    const calculateKibor = (row) =>
        calculateGuaranteeValue(row) *
        (calculateTotalRate(row) / 100) *
        (toNumber(row.years) || 1);

    const calculateBankTotal = (row) =>
        calculateCommission(row) + calculateKibor(row);

    const calculateInsuranceTotal = (row) => calculateKibor(row);

    const calculatePerYear = (row) =>
        calculateGuaranteeValue(row) * (calculateTotalRate(row) / 100);

    const calculatePerQuarter = (row) => calculatePerYear(row) / 4;

    const calculateTotalQuarterAmount = (row) =>
        calculatePerQuarter(row) * toNumber(row.totalQuarters);

    // --- Update row data ---
    const handleChange = (e, index, field, type) => {
        let value = e.target.value;
        if (e.target.type === "number") {
            value = value === "" ? "" : toNumber(value);
        }
        if (type === "Bank") {
            setBankRows((prev) => {
                const newData = [...prev];
                newData[index][field] = value;
                return newData;
            });
        } else {
            setInsuranceRows((prev) => {
                const newData = [...prev];
                newData[index][field] = value;
                return newData;
            });
        }
    };

    // --- Add new row ---
    const handleAddRow = (e, type) => {
        if (e.key === "Enter") {
            if (type === "Bank") {
                setBankRows((prev) => [
                    ...prev,
                    {
                        source: "Bank",
                        customerName: "",
                        projectValue: 0,
                        guaranteePercent: 0,
                        years: 1,
                        totalQuarters: 4,
                        bankCommissionRate: 0,
                        kibor: 0,
                        excessKibor: 0,
                    },
                ]);
            } else {
                setInsuranceRows((prev) => [
                    ...prev,
                    {
                        source: "Insurance Company",
                        customerName: "",
                        projectValue: 0,
                        guaranteePercent: 0,
                        years: 1,
                        totalQuarters: 4,
                        bankCommissionRate: 0,
                        kibor: 0,
                        excessKibor: 0,
                    },
                ]);
            }
        }
    };

    // --- Table Renderer ---
    const renderTable = (rows, type) => (
        <>
            <h3 className="main-heading">{type} Table</h3>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Customer</th>
                            <th>Project Value</th>
                            <th>Guarantee %</th>
                            <th>Guarantee Value</th>
                            <th>Construction Period</th>
                            <th>Kibor</th>
                            <th>Excess Kibor</th>
                            <th>Total Rate</th>
                            {type === "Bank" && <th>Bank Commission Rate</th>}
                            {type === "Bank" && <th>Commission</th>}
                            <th>Per Year</th>
                            <th>Per Quarter</th>
                            <th>Total Quarters</th>
                            {/* <th>Total Quarter Amount</th> */}
                            <th>Kibor Amount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} onKeyDown={(e) => handleAddRow(e, type)}>
                                <td>
                                    <input
                                        type="text"
                                        value={row.source}
                                        onChange={(e) => handleChange(e, i, "source", type)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.customerName}
                                        onChange={(e) => handleChange(e, i, "customerName", type)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.projectValue}
                                        onChange={(e) => handleChange(e, i, "projectValue", type)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.guaranteePercent}
                                        onChange={(e) => handleChange(e, i, "guaranteePercent", type)}
                                    />
                                </td>
                                <td>{calculateGuaranteeValue(row).toLocaleString()}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.years}
                                        onChange={(e) => handleChange(e, i, "years", type)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.kibor}
                                        onChange={(e) => handleChange(e, i, "kibor", type)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.excessKibor}
                                        onChange={(e) => handleChange(e, i, "excessKibor", type)}
                                    />
                                </td>
                                <td>{calculateTotalRate(row).toLocaleString()}%</td>
                                {type === "Bank" && (
                                    <>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={row.bankCommissionRate}
                                                onChange={(e) =>
                                                    handleChange(e, i, "bankCommissionRate", type)
                                                }
                                            />
                                        </td>
                                        <td>{calculateCommission(row).toLocaleString()}</td>
                                    </>
                                )}
                                <td>{calculatePerYear(row).toLocaleString()}</td>
                                <td>{calculatePerQuarter(row).toLocaleString()}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.totalQuarters}
                                        onChange={(e) => handleChange(e, i, "totalQuarters", type)}
                                    />
                                </td>
                                {/* <td>{calculateTotalQuarterAmount    (row).toLocaleString()}</td> */}
                                <td>{calculateKibor(row).toLocaleString()}</td>
                                <td>
                                    {type === "Bank"
                                        ? calculateBankTotal(row).toLocaleString()
                                        : calculateInsuranceTotal(row).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    return (
        <div className="main-container">
            <h2 className="main-heading">Performance Guarantee</h2>
            {renderTable(bankRows, "Bank")}
            {renderTable(insuranceRows, "Insurance Company")}
        </div>
    );
};

export default PerformanceGuarantee;
