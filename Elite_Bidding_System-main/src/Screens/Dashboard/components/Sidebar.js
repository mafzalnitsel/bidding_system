import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";

const Sidebar = () => {
  const [hide, setHide] = useState(false);
  return (
    <div>
      <button
        onClick={() => setHide(!hide)}
        className={`hamburger ${hide ? "hidden" : ""}`}
      >
        <RxHamburgerMenu size={24} />
      </button>
      <div className={`sidebar ${hide ? "hidden" : ""}`}>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/Bidding">
                <span>Bidding</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/BidElement">
                <span>Bid Element</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/Packages">
                <span>Packages</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/">
                <span>Logout</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
