import React, { useState } from 'react';
import './IndirectCostStructure.css';
import OtherOverHeads from '../OtherOverHeads';

const Folder = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="folder">
            <div className="folder-title" onClick={() => setIsOpen(!isOpen)}>
                <span className="folder-icon">{isOpen ? '📂' : '📁'}</span>
                {title}
            </div>
            {isOpen && <div className="folder-content">{children}</div>}
        </div>
    );
};

const SubFolder = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="subfolder">
            <div className="subfolder-title" onClick={() => setIsOpen(!isOpen)}>
                <span className="subfolder-icon">{isOpen ? '📄' : '📃'}</span>
                {title}
            </div>
            {isOpen && <div className="subfolder-content">{content}</div>}
        </div>
    );
};

const IndirectCostStructure = () => {
    return (
        <div className="indirect-cost-container">
            <Folder title="Construction Overheads">
                <SubFolder title="Cartage & Octroi" content="PKR 750,000 — 0.08%" />
                <SubFolder title="Contractor's All Risk Insurance" content="PKR 6,500,000 — 0.69%" />
                <SubFolder title="Depreciation of Equipment" content="PKR 8,112,295.40 — 0.87%" />
                <SubFolder title="Repair & Maintenance" content="PKR 250,000 — 0.03%" />
                <SubFolder title="POL of Equipment" content="PKR 63,162,736 — 6.75%" />
                <SubFolder title="Rental Equipments" content="PKR 89,548,900 — 9.56%" />
                <SubFolder title="Tools" content="PKR 3,150,000 — 0.34%" />
                <SubFolder title="Utilities" content="PKR 138,000 — 0.01%" />
                <SubFolder title="Warranty Maintenance" content="PKR 1,250,000 — 0.13%" />
            </Folder>

            <Folder title="Site Facility">
                <SubFolder title="Client's Facilities" content="PKR 1,571,000 — 0.17%" />
                <SubFolder title="Offices" content="PKR 1,050,000 — 0.11%" />
                <SubFolder title="Residential Facilities" content="PKR 2,552,000 — 0.27%" />
                <SubFolder title="Utilities Network" content="PKR 2,400,000 — 0.26%" />
                <SubFolder title="Warehouse" content="PKR 5,960,000 — 0.64%" />
            </Folder>

            <Folder title="Salaries & Non-Cash Benefits">
                <SubFolder title="Salaries & Allowances" content="PKR 14,653,274 — 1.56%" />
                <SubFolder title="Workmen Compensation" content="PKR 3,519,120 — 0.38%" />
            </Folder>

            <Folder title="Other Overheads">
                <SubFolder title="Depreciation (Other Assets)" content="PKR 875,830 — 0.09%" />
                <SubFolder title="Misc. Overheads" content={<OtherOverHeads />} />
                <SubFolder title="Vehicle Rentals" content="PKR 3,452,400 — 0.37%" />
            </Folder>
        </div>
    );
};

export default IndirectCostStructure;
