import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import "./index.css";
import {
  Loader,
  CustomSelect,
  TableCustomStyle,
  Header,
  fixedtablediv,
  fixedtableheader,
  fixedtablerow,
} from "../../Utils";
import { Table } from "react-bootstrap";
import LINKS from "../../Utils/Links";
import axios from "axios";
import CustomModal from "../Common/Modal";
import { ImArrowRight } from "react-icons/im";
import ModalForMaterials from "../Common/ModalForMaterials";
import { useAlert } from "react-alert";
import { cacheUtils } from "../../Utils/Caching";
function PackageElement({ data }) {
  const alert = useAlert();
  const [SelectedItems, setSelectedItems] = useState([{ abc: "abc" }]);
  const [headerdata, setheaderdata] = useState({ incomtax: "" });
  const [loading, setLoading] = useState(false);
  const [doctotal, setdoctotal] = useState();
  const [type, settype] = useState();
  const [searchModal, setSearchModal] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const codeRef = useRef();

  const API_TYPES = {
    GET: `${LINKS.api}/GetApi`,
    POST: `${LINKS.api}/POSTApi`,
    PATCH: `${LINKS.api}/PATCHApi`,
    DELETE: `${LINKS.api}/DELETEApi`,
    SECONDPOST: `${LINKS.api}/SecondDBPOSTApi`,
  };

  useEffect(() => {
    if (data) {
      setheaderdata(data);
      setSelectedItems(data?.MMP1Collection);
    }
  }, []);

  const getvaluefrominput = (e) => {
    const { name, value } = e.target;
    setheaderdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // console.log("data", { ...headerdata, [name]: value });
  };

  const submit = async () => {
    setLoading(true);
    console.log("headerdata", headerdata);
    let body = {
      Code: headerdata?.Code,
      Name: headerdata?.Name,
    };
    console.log("body", body);

    PostInFirstDB(body);
  };

  const PostInFirstDB = async (body) => {
    let cook = await localStorage.getItem("cookie");
    if (cook) {
      await axios
        .post(API_TYPES.POST, {
          body: JSON.stringify(body),
          api: `OMMT`,
          cookie: cook,
        })
        .then(function (res) {
          console.log(res);
          if (res.data?.Code) {
            alert.success("Operation completed successfully");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            alert.error(JSON.stringify(res.data.error.message));
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const submitPatch = async (RowCode, callback) => {
    setLoading(true);
    console.log("tabledetails", SelectedItems);
    console.log("headerdata", headerdata);

    let body = {
      Code: headerdata?.Code,
      Name: headerdata?.Name,
    };

    patch(headerdata.Code, body, callback);
  };

  const patch = async (id, body, callback) => {
    let cook = await localStorage.getItem("cookie");
    if (cook) {
      await axios
        .post(API_TYPES.PATCH, {
          body: JSON.stringify(body),
          api: `OMMT('${id}')`,
          cookie: cook,
        })
        .then(function (res) {
          if (
            res.data === "update" ||
            (res.data === "You Are Not Permited To Perform This Action" &&
              !isUpdating)
          ) {
            if (callback) callback();
            if (res.data === "update")
              alert.success("Operation completed successfully");
          } else {
            alert.error(JSON.stringify(res.data.error.message));
          }
        })
        .catch(function (error) { })
        .finally(() => {
          setLoading(false);
        });
    }
  };


  // const getElementsToDelete = async (cook) => {
  //   let SAPApi = `OMMT?$filter=not (startswith(Code, 'FA')) &$select=Code`;
  //   return (await axios
  //     .post(API_TYPES.GET, {
  //       api: SAPApi,
  //       cookie: cook,
  //     })).data.value
  // };


  // const deleteAPI = async (cook, code) => {

  //   return (await axios
  //     .post(API_TYPES.DELETE, {
  //       api: `OMMT('${code}')`,
  //       cookie: cook,
  //     })).data
  // }

  // const main = async () => {
  //   const cook = localStorage.getItem("cookie")
  //   const data = await getElementsToDelete(cook)

  //   console.log(data);



  //   const codes = data?.map(item => item.Code)

  //   for (const code of codes) {
  //     console.log("deleting...", code);
  //     await deleteAPI(cook, code)

  //   }
  //   // const restult = await deleteAPI(cook, data)

  // }


  // main()


  const fetchAllData = async (cook) => {
    setLoading(true);
    console.log("fetching all data...");
    let SAPApi = `OMMT?$select=Code,Name`;
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        if (res.data.value) {
          console.log("res for search ", res.data.value);

          setSearchData(res.data.value);
          setSearchModal(true);
          setLoading(false);
        }
        return res
      })
      .catch(function (error) { })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchFilteredData = async (value, cook) => {
    setLoading(true);
    console.log("fetching filtered data...");
    setSearchData([]);
    let SAPApi = `OMMT?$filter=Code eq '${encodeURIComponent(value)}'`;
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        console.log("res for search", res.data);
        if (res.data.value) {
          // setSearchData(res.data.value);
          const data = res.data.value[0];

          if (!data) {
            setheaderdata(prev => ({
              Code: prev?.Code,
              Name: "",
            }));

            alert.error(`Nothing Found For, With ${value} Code!!!`);
            setIsUpdating(false)
          } else {
            setIsUpdating(true)
            setheaderdata(data);
            setSelectedItems(data?.MMP1Collection);
            // setSearchModal(true);
            // setLoading(false);
          }
        }
      })
      .catch(function (error) { })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleSearchKeyDown = async (e) => {
    let cook = await localStorage.getItem("cookie");
    if (e.key === "Enter") {
      if (e.target.value === "*") {
        fetchAllData(cook);
      } else {
        fetchFilteredData(e.target.value, cook);
      }
    }
  };

  const handlePopulatePackageDataFromSearch = (itemData) => {
    setIsUpdating(true)
    setheaderdata(itemData);
    console.log({ itemData });
    setSearchModal(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        e.preventDefault();
        if (codeRef && codeRef?.current) {
          codeRef.current.focus();
          codeRef.current.classList.add("active");
        }
      } else {
        if (codeRef && codeRef?.current) {
          codeRef.current.classList.remove("active");
        }
      }
    });
  }, []);

  return (
    <>
      <Loader visible={loading} />

      <ModalForMaterials
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        packageData={packageData}
      />

      {!data && <Header />}
      {data && (
        <div className="hero-logo">
          <img
            alt="Logo"
            src="/Images/nitsel.png"
            width="200px"
            height="70px"
            className="d-inline-block align-top"
          />
        </div>
      )}

      <CustomModal
        title={"List of Packages"}
        isOpen={searchModal}
        setIsOpen={() => setSearchModal(false)}
      >
        <Table striped bordered hover className="table">
          <thead>
            <tr className="table_header_row">
              <th>Code</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {!!searchData ? (
              searchData?.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handlePopulatePackageDataFromSearch(item)}
                  className="table_body_row"
                >
                  <td>{item?.Code}</td>
                  <td>{item?.Name}</td>
                </tr>
              ))
            ) : (
              <div>No Search Data</div>
            )}
          </tbody>
        </Table>
      </CustomModal>
      <div>
        <h1
          style={{
            textAlign: "center",
            color: "#c32127",
            margin: "30px",
          }}
        >
          Package Element
        </h1>
      </div>

      <div className="main_container">
        <div className="left">
          <div className="header_items_container">
            <label>Code</label>
            <input
              ref={codeRef}
              type="email"
              value={headerdata?.Code}
              onChange={(e) => getvaluefrominput(e)}
              onKeyDown={handleSearchKeyDown}
              className="input code_input"
              name="Code"
            />
          </div>

          <div className="header_items_container">
            <label>Name</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              value={headerdata?.Name}
              name="Name"
              type="text"
              className="input"
            />
          </div>
        </div>
        <div className="right"></div>
      </div>

      {!data && (
        <div className="button_main_container">
          <button
            type="button"
            className="custombutton"
            tabIndex="0"
            disabled={loading}
            onClick={() => {
              if (isUpdating) {
                submitPatch();
              } else {
                submit();
              }
            }}
          >
            {isUpdating ? "Update" : "Add"}
          </button>
        </div>
      )}
    </>
  );
}

export default PackageElement;
