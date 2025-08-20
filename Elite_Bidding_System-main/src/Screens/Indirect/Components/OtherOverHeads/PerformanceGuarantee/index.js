import React, { useState } from "react";

const PerformanceGuarantee = () => {
    // --- Separate state hooks for each table ---
    const [bankRows, setBankRows] = useState([
        {
            source: "Bank",
            customerName: "Riko Dik Project",
            projectValue: 1750000000,
            guaranteePercent: 10,
            years: 2.5,
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
            bankCommissionRate: 0.02,
            kibor: 11,
            excessKibor: 2,
        },
    ]);

    // --- Calculations ---
    const calculateGuaranteeValue = (row) =>
        (row.projectValue * row.guaranteePercent) / 100;

    const calculateTotalRate = (row) =>
        parseFloat(row.kibor) + parseFloat(row.excessKibor);

    const calculateCommission = (row) =>
        calculateGuaranteeValue(row) *
        parseFloat(row.bankCommissionRate) *
        parseFloat(row.years);

    const calculateKibor = (row) =>
        calculateGuaranteeValue(row) *
        (calculateTotalRate(row) / 100) *
        parseFloat(row.years);

    const calculateBankTotal = (row) =>
        calculateCommission(row) + calculateKibor(row);

    const calculateInsuranceTotal = (row) => calculateKibor(row);

    // --- Update row data ---
    const handleChange = (e, index, field, type) => {
        const value = e.target.value;

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
        <div className="table-container">
            <h3>{type} Table</h3>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Source</th>
                        <th>Customer</th>
                        <th>Project Value</th>
                        <th>Guarantee %</th>
                        <th>Guarantee Value</th>
                        <th>Years</th>
                        <th>Kibor</th>
                        <th>Excess Kibor</th>
                        <th>Total Rate</th>
                        {type === "Bank" && <th>Bank Commission Rate</th>}
                        {type === "Bank" && <th>Commission</th>}
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
                            <td>{calculateTotalRate(row)}%</td>
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
