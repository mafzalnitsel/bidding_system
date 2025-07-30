import React from "react";
import "./index.css";

const MobilizationAdvanceTable = () => {
    return (
        <div className="mobilization-table-container">
            <h3>PN Farm Sector D</h3>
            <p><strong>Approximate Cost:</strong> 500,000,000</p>
            <p><strong>Contract Period:</strong> 18 Months</p>
            <h4>Mobilization Advance Guarantee from Bank (Reduced Values Basis)</h4>

            <table className="table table-bordered table-striped" style={{ marginTop: "20px", width: "100%", textAlign: "center" }}>
                <thead style={{ backgroundColor: "#0b9fc8", color: "#fff" }}>
                    <tr>
                        <th rowSpan="2">Qtr. Nos.</th>
                        <th rowSpan="2">P A R T I C U L A R S</th>
                        <th colSpan="2">Minimum</th>
                        <th colSpan="2">Higher Side</th>
                    </tr>
                    <tr>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mobilization Advance Guarantee @ 10%<br /><small>(Value: 50,000,000)</small></td>
                        <td>0.232%</td>
                        <td>116,000</td>
                        <td>0.250%</td>
                        <td>125,000</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>41,666,667</td>
                        <td>0.232%</td>
                        <td>96,667</td>
                        <td>0.250%</td>
                        <td>104,167</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>33,333,334</td>
                        <td>0.232%</td>
                        <td>77,333</td>
                        <td>0.250%</td>
                        <td>83,333</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>25,000,001</td>
                        <td>0.232%</td>
                        <td>58,000</td>
                        <td>0.250%</td>
                        <td>62,500</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>16,666,668</td>
                        <td>0.232%</td>
                        <td>38,667</td>
                        <td>0.250%</td>
                        <td>41,667</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>8,333,335</td>
                        <td>0.232%</td>
                        <td>19,333</td>
                        <td>0.250%</td>
                        <td>20,833</td>
                    </tr>
                    <tr style={{ fontWeight: "bold" }}>
                        <td colSpan="3" style={{ textAlign: "right" }}>Total</td>
                        <td>406,000</td>
                        <td></td>
                        <td>437,500</td>
                    </tr>
                </tbody>
            </table>

            <p style={{ marginTop: "15px", fontStyle: "italic" }}>
                <strong>Note:</strong> Above amounts are calculated in case of project completion according to planned period of 18 months.
            </p>
        </div>
    );
};

export default MobilizationAdvanceTable;
