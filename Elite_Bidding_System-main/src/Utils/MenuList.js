import React, { useMemo } from "react";
import { FixedSizeList as List } from "react-window";

const MenuList = ({ children = [], maxHeight, isLoading }) => {
  const itemSize = 25; // Height of each item
  const itemCount = isLoading ? 10 : children.length; // Show 10 placeholder items if loading

  // Memoize children to prevent unnecessary recalculations
  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <List
      height={maxHeight}
      itemCount={itemCount}
      itemSize={itemSize}
      width="100%"
      style={{ background: "white", borderRadius: "5px" }}
    >
      {({ index, style, isScrolling }) => (
        <div style={{ ...style, padding: "5px", whiteSpace: "nowrap" }}>
          {isLoading || isScrolling
            ? "Loading..." // Show placeholder while scrolling or loading
            : memoizedChildren[index]}
        </div>
      )}
    </List>
  );
};

export default React.memo(MenuList);
