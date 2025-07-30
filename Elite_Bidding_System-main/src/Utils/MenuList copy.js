import React, { useState, useEffect, useRef } from "react";

const MenuList = ({ children = [], maxHeight = 300, loading = false }) => {
  const containerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(20); // Initially show 10 items

  // Function to handle lazy-loading on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // When user scrolls to the bottom, load 10 more items
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setVisibleItems((prev) => Math.min(prev + 10, children.length));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight,
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "5px",
        background: "white",
        padding: "5px",
      }}
    >
      {loading ? (
        <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
          Loading...
        </div>
      ) : children.length > 0 ? (
        children.slice(0, visibleItems).map((child, index) => (
          <div
            key={index}
            style={{
              whiteSpace: "nowrap",
              borderBottom: "1px solid #eee",
            }}
          >
            {child}
          </div>
        ))
      ) : (
        <div style={{ padding: "10px", textAlign: "center", color: "#999" }}>
          No items found
        </div>
      )}
    </div>
  );
};

export default React.memo(MenuList);
