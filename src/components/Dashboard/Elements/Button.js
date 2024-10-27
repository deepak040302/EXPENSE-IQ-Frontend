import React from "react";

function Button({itemName, itemIcon ,itemId,itemOnClick}) {
  return (
    <div className="button">
      <div> {itemIcon}</div>
      <div onClick={itemOnClick}>{itemName}</div>
    </div>
  );
}

export default Button;
