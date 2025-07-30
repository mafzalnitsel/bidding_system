import React, { useEffect, useState, useRef } from 'react'
import Select from "react-select";
import "./index.css";
import { Loader, CustomSelect, Header, fixedtablediv, fixedtableheader, fixedtablerow } from "../../Utils";
import { Table } from "react-bootstrap";
import LINKS from "../../Utils/Links";
import * as XLSX from 'xlsx';
import axios from 'axios';
function Bidding() {
    const fileInputRef = useRef(null);
    const [SelectedItems, setSelectedItems] = useState([{ abc: 'abc' }])
    const [headerdata, setheaderdata] = useState({ incomtax: 7.5, federal: 18 })
    const [loading, setLoading] = useState(true);
    const [TaxCodelist, setTaxCodelist] = useState()
    const [tableheader, settableheader] = useState()
    const [tabledetails, settabledetails] = useState()
    const [update, setUpdate] = useState(1)
    const [excelData, setExcelData] = useState([])
    const API_TYPES = {
        GET: `${LINKS.api}/GetApi`,
        POST: `${LINKS.api}/POSTApi`,
        PATCH: `${LINKS.api}/PATCHApi`,
        SECONDPOST: `${LINKS.api}/SecondDBPOSTApi`,
    };
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 4000);
        let cook = localStorage.getItem("cookie");
        if (cook) {
            TableTaxCode(cook)
        }
    }, []);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange2 = (e) => {
        setLoading(true)
        // const selectedFile = e.target.files[0];
        const file = e.target.files[0];
        const reader = new FileReader();
        const dataarrange = []
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setExcelData(jsonData);
            console.log('jsonData', jsonData[0]);
            const existingHeaders = jsonData[0];
            const additionalHeaders = ['Quantity Client', 'Conversion', 'Unit System', 'Quantity System', 'Material Package', 'Consumable Package', 'Equipment Package', 'ManHours Labour'
                , 'SubContractor Labour', 'Package Material', 'SubContractor Material', 'Package Consumable', 'SubContractor Consumable', 'Package Equipment', 'SubContractor Equipment', 'Direct Cost'
                , 'Site Overheads', 'Profit', 'PST', 'Income Tax'];
            const additionalValues = {
                'Quantity_Client': '',
                'Conversion': '',
                'Unit_System': '',
                'Quantity_System': '',
                'Material_Package': '',
                'Consumable_Package': '',
                'Equipment_Package': '',
                'ManHours_Labour': '',
                'SubContractor_Labour': '',
                'Package_Material': '',
                'SubContractor_Material': '',
                'Package_Consumable': '',
                'SubContractor_Consumable': '',
                'Package_Equipment': '',
                'SubContractor_Equipment': '',
                'Direct_Cost': '',
                'Site_Overheads': '',
                'Profit': '',
                'PST': '',
                'Income_Tax': '',
            };
            const allHeaders = [...existingHeaders, ...additionalHeaders];
            settableheader(allHeaders);
            console.log('allHeaders', allHeaders);
            const filteredDataArray = jsonData.filter(item => item.length > 0);
            // Define the property names
            const propertyNames = jsonData[0];
            filteredDataArray.shift();
            // Transforming the data dynamically
            const formatPropertyName = name => (typeof name === 'string' ? name.replace(/\s/g, '_') : name);
            const transformedData = filteredDataArray.map(dataArrayItem => {
                const transformedObject = {};
                propertyNames.forEach((propertyName, index) => {
                    const formattedPropertyName = formatPropertyName(propertyName);
                    console.log('formattedPropertyName', formattedPropertyName);
                    transformedObject[formattedPropertyName === "PUNJAB_RURAL_SUSTAINABLE_WATER_SUPPLY_&_SANITATION_PROJECT_(PRSWSSP)" ? "BOQName" : formattedPropertyName] = dataArrayItem[index];

                });
                Object.assign(transformedObject, additionalValues);
                return transformedObject;
            });
            setLoading(false)
            console.log('transformedData', transformedData.slice(0, 10));
            settabledetails(transformedData.slice(0, 10));
        }
        reader.readAsArrayBuffer(file);
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert the sheet to JSON, keeping empty cells as empty strings
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                header: 1, // Keep it as an array of arrays
                defval: ''  // Ensure empty cells are kept as empty strings
            });

            // Find the index of the row where the first column contains "Sr.No"
            const srNoRowIndex = jsonData.findIndex(row => row[0] === "Sr.No");

            // If "Sr.No" row is found, slice the data from the next row onward
            let filteredDataArray = [];
            if (srNoRowIndex !== -1) {
                filteredDataArray = jsonData.slice(srNoRowIndex + 1);
            } else {
                // If "Sr.No" is not found, use the original data
                filteredDataArray = jsonData;
            }

            // Optional: Further filter out rows that are completely empty
            filteredDataArray = filteredDataArray.filter(row => row.some(cell => cell !== ''));

            settabledetails(filteredDataArray);
            // console.log('filteredDataArray', filteredDataArray);
            // filteredDataArray.forEach((element) => {
            //     console.log('element', element[2]);
            // });
        };
        reader.readAsArrayBuffer(file);
    };



    const TableTaxCode = async (cook) => {
        // -------------------------    Items API GET DATA   ------------------------------------------------------
        let SAPApi = `VatGroups?$select=Code,Name,VatGroups_Lines&$filter=Inactive eq 'tNO'`;
        await axios
            .post(API_TYPES.GET, {
                api: SAPApi,
                cookie: cook,
            })
            .then(function (res) {
                if (res.data.value) {
                    let ItemsDropDown = [];
                    res.data.value.forEach((element) => {
                        ItemsDropDown.push({
                            value: element.Code,
                            label: element.Name + " : " + element.Code,
                            item: element,
                        });
                    });
                    setTaxCodelist(ItemsDropDown);
                }
            })
            .catch(function (error) { });
    };
    const getvaluefrominput = (e) => {
        let data = headerdata
        data[e.target.name] = e.target
            .value
        setheaderdata(data)
    }
    const getvaluefromselect = (e, name) => {
        let data = headerdata
        // data[name] = e.item?.VatGroups_Lines[0]?.Rate
        data[name] = e.value
        setheaderdata(data)
    }
    const tablegetvaluefrominput = (e, index) => {
        const updatedDetails = [...tabledetails];
        updatedDetails[index][e.target.name] = Number(e.target.value);
        const directCostFields = ['ManHours_Labour', 'SubContractor_Labour', 'Package_Material', 'SubContractor_Material', 'Package_Consumable',
            'SubContractor_Consumable', 'Package_Equipment', 'SubContractor_Equipment'];
        updatedDetails[index]['Direct_Cost'] = directCostFields.reduce((sum, field) => sum + Number(updatedDetails[index][field]), 0);
        updatedDetails[index]['Site_Overheads'] = updatedDetails[index]['Direct_Cost'] * headerdata?.siteoverheads
        updatedDetails[index]['Profit'] = (updatedDetails[index]['Site_Overheads'] + updatedDetails[index]['Direct_Cost']) * headerdata?.profit
        updatedDetails[index]['PST'] = ((updatedDetails[index]['Direct_Cost'] + updatedDetails[index]['Site_Overheads'] + updatedDetails[index]['Profit']) / (1 - headerdata?.PST)) -
            (updatedDetails[index]['Direct_Cost'] + updatedDetails[index]['Site_Overheads'] + updatedDetails[index]['Profit'])
        updatedDetails[index]['Income_Tax'] = ((updatedDetails[index]['Direct_Cost'] + updatedDetails[index]['Site_Overheads'] + updatedDetails[index]['Profit'] + updatedDetails[index]['PST'])
            / (1 - headerdata?.incomtax)) -
            (updatedDetails[index]['Direct_Cost'] + updatedDetails[index]['Site_Overheads'] + updatedDetails[index]['Profit'] + updatedDetails[index]['PST'])
        settabledetails(updatedDetails);
    }
    const submit = async () => {
        console.log('tabledetails', tabledetails);
        console.log('headerdata', headerdata);
        let details = []
        tabledetails.forEach(item => {
            details.push({
                U_BOQNo: item.U_BOQNo,
                U_QuantityClient: item.Quantity_Client,
                U_Conversion: item.Conversion,
                U_UnitSystem: item.Unit_System,
                U_QuantitySystem: item.Quantity_System,
                U_MaterialPackage: item.Material_Package,
                U_ConsumablePackage: item.Consumable_Package,
                U_EquipmentPackage: item.Equipment_Package,
                U_ManHoursLabour: item.ManHours_Labour,
                U_SubContractorLabour: item.SubContractor_Labour,
                U_PackageMaterial: item.Package_Material,
                U_SubContractorMaterial: item.SubContractor_Material,
                U_PackageConsumable: item.Package_Consumable,
                U_SubContractorConsumable: item.SubContractor_Consumable,
                U_PackageEquipment: item.Package_Equipment,
                U_SubContractorEquipment: item.SubContractor_Equipment,
                U_DirectCost: item.Direct_Cost,
                U_SiteOverheads: item.Site_Overheads,
                U_Profit: item.Profit,
                U_PST: item.PST
            })
        })
        let body = {
            // U_QuotationNo: headerdata?. null,
            U_ClientName: headerdata?.clientname,
            U_ContractType: headerdata?.Contracttype,
            U_ConstructionPeriod: headerdata?.constructionperiod,
            U_FurnishedMaterial: headerdata?.FurnishedMaterial,
            U_Escalation: headerdata?.Escalation,
            U_SiteOverHeads: headerdata?.siteoverheads,
            U_ReceivedDate: headerdata?.receiveddate,
            U_SubmissionDate: headerdata?.submissiondate,
            U_Profit: headerdata?.profit,
            U_PST: headerdata?.PST,
            U_IncomeTax: headerdata?.incomtax,
            U_ProjectLocation: headerdata?.location,
            EBS1Collection: details
        }
        console.log('body', body);
    }
    const tableHeaders = [
        "Serial No.", "BOQ No", "BOQ Description", "UoM Client", "Quantity Client",
        "Conversion", "Unit System", "Quantity System", "ManHours Labour",
        "SubContractor Labour", "Material Package", "Consumable Package",
        "Equipment Package", "SubContractor Material", "SubContractor Consumable",
        "SubContractor Equipment", "Direct Cost", "Site Overheads", "Head Office Overheads",
        "Profit", "Escalation", "Unforeseen", "Contingencies", "PST",
        "Income Tax", "Selling Price"
    ];

    return (
        <>
            <Loader visible={loading} />
            <Header />
            <div><h1 style={{ textAlign: 'center', color: '#c32127' }}>Consumable Packages</h1></div>
            <div className="main_container ">
                <div className="left">
                    <div className="header_items_container">
                        <label>Code</label>
                        <input
                            type="email"
                            readOnly
                            className="input"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Client Name</label>
                        <input
                            onChange={e => getvaluefrominput(e)}
                            name='clientname'
                            type="text"
                            className="input"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Contract Type</label>
                        <input
                            onChange={e => getvaluefrominput(e)}
                            name='Contracttype'
                            type="text"
                            className="input"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Construction Period</label>
                        <input
                            onChange={e => getvaluefrominput(e)}
                            name='constructionperiod'
                            type="text"
                            className="input"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Owner Furnished Material</label>
                        <Select
                            menuPortalTarget={document.body}
                            styles={CustomSelect}
                            name='FurnishedMaterial'
                            displayValue="name"
                            isMulti
                            options={[
                                { label: "Cement", value: "C" },
                                { label: "Steel", value: "S" },
                                { label: "Other", value: "O" }
                            ]}
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Escalation</label>
                        <Select
                            name='Escalation'
                            menuPortalTarget={document.body}
                            styles={CustomSelect}
                            onChange={e => console.log('Comment', e)}
                            options={[
                                { label: "Rebar", value: "Rebar" },
                                { label: "Cement", value: "Cement" },
                                { label: "Diesel", value: "Diesel" },
                                { label: "Petrol", value: 'Petrol' },
                                { label: "Labour", value: 'Labour' },
                                { label: "Masan", value: 'Masan' },
                            ]}
                            displayValue="name"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Site OverHeads</label>
                        <input
                            onChange={e => getvaluefrominput(e)}
                            name='siteoverheads'
                            type="input"
                            className="input"
                        />
                    </div>
                </div>
                <div className="right">
                    <div className="header_items_container">
                        <label>Received Date</label>
                        <input
                            onChange={e => getvaluefrominput(e)}
                            name='receiveddate'
                            type="date"
                            className="input"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Submission Date</label>
                        <input
                            onChange={e => getvaluefrominput(e)}
                            name='submissiondate'
                            type="date"
                            className="input"
                        />
                    </div>

                    <div className="header_items_container">
                        <label>Income Tax</label>
                        <input
                            defaultValue={headerdata?.incomtax + '%'}
                            type="input"
                            // options={TaxCodelist}
                            onChange={e => getvaluefrominput(e)}
                            name='incomtax'
                            readOnly
                            className="input"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Project Location</label>
                        <input
                            type="input"
                            onChange={e => getvaluefrominput(e)}
                            name='location'
                            className="input"
                        />
                    </div>
                </div>
            </div>
            <div className="button_main_container">
                <button type="button"
                    className='custombutton'
                    tabIndex="0"
                    onClick={submit}
                >
                    Submit
                </button>
                <button type="button"
                    className='custombutton'
                >
                    Cancel
                </button>
            </div>

        </>

    );
}

export default Bidding;
