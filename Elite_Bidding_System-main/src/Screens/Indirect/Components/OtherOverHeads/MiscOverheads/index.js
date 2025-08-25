import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const initialData = [
    {
        qtrNo: "1",
        particulars: "Mobilization Advance Guarantee @ 10%",
        value: "50,000,000",
        minRate: "0.232",
        minAmount: "",
        highRate: "0.250",
        highAmount: "",
    },
];

const MobilizationAdvanceTable = () => {
    const [rows, setRows] = useState(initialData);
    const [total, setTotal] = useState({ minAmount: "0", highAmount: "0" });
    const [approxCost, setApproxCost] = useState("500,000,000");
    const [contractPeriod, setContractPeriod] = useState("18");

    const performCalculations = () => {
        const updatedRows = rows.map((r) => {
            const val = parseFloat(r.value.replace(/,/g, "")) || 0;
            const minAmt = ((val * parseFloat(r.minRate || 0)) / 100).toFixed(0);
            const highAmt = ((val * parseFloat(r.highRate || 0)) / 100).toFixed(0);
            return { ...r, minAmount: minAmt, highAmount: highAmt };
        });

        setRows(updatedRows);

        const sumMin = updatedRows.reduce(
            (acc, r) => acc + Number(r.minAmount),
            0
        );
        const sumHigh = updatedRows.reduce(
            (acc, r) => acc + Number(r.highAmount),
            0
        );
        setTotal({
            minAmount: sumMin.toLocaleString(),
            highAmount: sumHigh.toLocaleString(),
        });
    }

    useEffect(() => {
        performCalculations()
    }, [])

    // Update individual cell values
    const handleChange = (idx, field, value) => {
        const newRows = [...rows];
        newRows[idx][field] = value;
        setRows(newRows)
        performCalculations()
    };

    // Listen for Ctrl + Enter to add a new row
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "Enter") {
                e.preventDefault();
                const newRow = {
                    qtrNo: (rows.length + 1).toString(),
                    particulars: "",
                    value: "",
                    minRate: "",
                    minAmount: "",
                    highRate: "",
                    highAmount: "",
                };
                setRows((prev) => [...prev, newRow]);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [rows]);

    return (
        <>
            {/* <div>
                <h1
                    style={{ textAlign: "center", color: "#c32127", margin: "30px" }}
                >
                    PN Farm Sector D - Mobilization Advance
                </h1>
            </div> */}

            <div className="main_container" style={{ padding: "20px" }}>
                <div className="header_items_container">
                    <label>
                        <strong>Approximate Cost:</strong>{" "}
                        <input
                            className="form-control"
                            type="text"
                            value={approxCost}
                            onChange={(e) => setApproxCost(e.target.value)}
                            style={{ display: "inline-block", width: "auto" }}
                        />
                    </label>
                </div>
                <div className="header_items_container">
                    <label>
                        <strong>Contract Period (Months):</strong>{" "}
                        <input
                            className="form-control"
                            type="text"
                            value={contractPeriod}
                            onChange={(e) => setContractPeriod(e.target.value)}
                            style={{ display: "inline-block", width: "auto" }}
                        />
                    </label>
                </div>
            </div>

            <div className="table_container" style={{ margin: "20px", overflowX: "auto" }}>
                <Table striped bordered hover>
                    <thead style={{ background: "#0b9fc8", color: "white", position: "sticky", top: 0 }}>
                        <tr>
                            <th>Qtr. Nos.</th>
                            <th>PARTICULARS</th>
                            <th>Value</th>
                            <th>Minimum Rate</th>
                            <th>Minimum Amount</th>
                            <th>Higher Side Rate</th>
                            <th>Higher Side Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i}>
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={r.qtrNo}
                                        onChange={(e) => handleChange(i, "qtrNo", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={r.particulars}
                                        onChange={(e) => handleChange(i, "particulars", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={r.value}
                                        onChange={(e) => handleChange(i, "value", e.target.value)}
                                    />
                                </td>
                                <td className="flex-center">
                                    <input
                                        className="form-control"
                                        type="number"
                                        step="0.001"
                                        value={r.minRate}
                                        onChange={(e) => handleChange(i, "minRate", e.target.value)}
                                    />
                                    <span className="percentage-padding">%</span>
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={r.minAmount}
                                        disabled
                                    />
                                </td>
                                <td className="flex-center">
                                    <input
                                        className="form-control"
                                        type="number"
                                        step="0.001"
                                        value={r.highRate}
                                        onChange={(e) => handleChange(i, "highRate", e.target.value)}
                                    />
                                    <span className="percentage-padding">%</span>
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={r.highAmount}
                                        disabled
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr style={{ fontWeight: "bold" }}>
                            <td colSpan={4} style={{ textAlign: "right" }}>
                                Total
                            </td>
                            <td>{total.minAmount}</td>
                            <td></td>
                            <td>{total.highAmount}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div className="notes_container" style={{ margin: "20px" }}>
                <p><strong>Note:</strong> Above amounts are auto-calculated for a contract period of {!contractPeriod ? null : `${contractPeriod} Months.`}</p>
                <p style={{ fontStyle: "italic" }}>
                    Press <strong>Ctrl + Enter</strong> to add a new row.
                </p>
            </div>
        </>
    );
};

export default MobilizationAdvanceTable;
