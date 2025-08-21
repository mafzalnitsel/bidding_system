import React, { useState } from "react";

const toNumber = (val, fallback = 0) => {
    const num = parseFloat(val);
    return isNaN(num) ? fallback : num;
};

const emptyBankRow = {
    source: "Bank",
    customerName: "",
    projectValue: "",
    guaranteePercent: "",
    years: "",
    bankCommissionRate: "",
    kibor: "",
    excessKibor: "",
};

const emptyInsuranceRow = {
    source: "Insurance Company",
    customerName: "",
    projectValue: "",
    guaranteePercent: "",
    years: "",
    bankCommissionRate: "",
    kibor: "",
    excessKibor: "",
};

const MobilizationGuarantee = () => {
    const [bankRows, setBankRows] = useState([
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

    // --- Handle change ---
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

    // --- Add new row on Enter ---
    const handleKeyDown = (e, type) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (type === "Bank") {
                setBankRows((prev) => [...prev, { ...emptyBankRow }]);
            } else {
                setInsuranceRows((prev) => [...prev, { ...emptyInsuranceRow }]);
            }
        }
    };

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

    // --- Render ---
    const renderTable = (rows, type) => (
        <div className="table-container">
            <h3 className="main-heading">{type} Table</h3>
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
                                    onChange={(e) =>
                                        handleChange(e, i, "source", type)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, type)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.customerName}
                                    onChange={(e) =>
                                        handleChange(e, i, "customerName", type)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, type)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.projectValue}
                                    onChange={(e) =>
                                        handleChange(e, i, "projectValue", type)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, type)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.guaranteePercent}
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            i,
                                            "guaranteePercent",
                                            type
                                        )
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, type)}
                                />
                            </td>
                            <td>{calculateGuaranteeValue(row).toLocaleString()}</td>
                            <td>
                                <input
                                    type="number"
                                    value={row.years}
                                    onChange={(e) =>
                                        handleChange(e, i, "years", type)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, type)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.kibor}
                                    onChange={(e) =>
                                        handleChange(e, i, "kibor", type)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, type)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.excessKibor}
                                    onChange={(e) =>
                                        handleChange(e, i, "excessKibor", type)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, type)}
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
                                                handleChange(
                                                    e,
                                                    i,
                                                    "bankCommissionRate",
                                                    type
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyDown(e, type)
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
            <h2 className="main-heading">Mobilization Guarantee</h2>
            {renderTable(bankRows, "Bank")}
            {renderTable(insuranceRows, "Insurance Company")}
        </div>
    );
};

export default MobilizationGuarantee;
