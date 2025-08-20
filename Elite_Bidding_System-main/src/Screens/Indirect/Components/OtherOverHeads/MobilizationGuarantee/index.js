import React, { useEffect, useState } from "react";

const MobilizationGuarantee = () => {
    const defaultData = [
        {
            source: "Bank",
            customerName: "Riko Dik Project",
            projectValue: 1750000000,
            guaranteePercent: 25,
            years: 1.5,
            bankCommissionRate: 0.01,
            kibor: 11,
            excessKibor: 2,
        },
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
    ];

    const [tableData, setTableData] = useState(defaultData);

    const handleChange = (e, index, field) => {
        const value = e.target.value;
        setTableData((prev) => {
            const newData = [...prev];
            newData[index][field] = value;
            return newData;
        });
    };

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

    // Bank: commission + kibor
    const calculateBankTotal = (row) =>
        calculateCommission(row) + calculateKibor(row);

    // Insurance: only kibor
    const calculateInsuranceTotal = (row) => calculateKibor(row);

    // --- Split data ---
    const bankRows = tableData.filter((row) => row.source === "Bank");
    const insuranceRows = tableData.filter(
        (row) => row.source === "Insurance Company"
    );

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
                        <tr key={i}>
                            <td>
                                <input
                                    type="text"
                                    value={row.source}
                                    onChange={(e) => handleChange(e, i, "source")}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.customerName}
                                    onChange={(e) => handleChange(e, i, "customerName")}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.projectValue}
                                    onChange={(e) => handleChange(e, i, "projectValue")}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.guaranteePercent}
                                    onChange={(e) => handleChange(e, i, "guaranteePercent")}
                                />
                            </td>
                            <td>{calculateGuaranteeValue(row).toLocaleString()}</td>
                            <td>
                                <input
                                    type="number"
                                    value={row.years}
                                    onChange={(e) => handleChange(e, i, "years")}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.kibor}
                                    onChange={(e) => handleChange(e, i, "kibor")}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.excessKibor}
                                    onChange={(e) => handleChange(e, i, "excessKibor")}
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
                                            onChange={(e) => handleChange(e, i, "bankCommissionRate")}
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
            <h2 className="main-heading">Mobilization Guarantee</h2>
            {renderTable(bankRows, "Bank")}
            {renderTable(insuranceRows, "Insurance Company")}
        </div>
    );
};

export default MobilizationGuarantee;
