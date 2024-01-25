import React from "react";
import Svg, { Rect } from "react-native-svg";

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { companyID } = props;
      const printStyles = `
      @media print {
        /* Set the page size here */
        @page {
            size: 2in 1in;
          }
  
        /* Reset some default styles for better print formatting */
        body {
          margin: 0;
        }

  
        /* Add other print-specific styles as needed */
      }
    `;    
  return (
    
    <div ref={ref}>
        <style>{printStyles}</style>
        <div>
          <text>{companyID}</text>
        </div>
    </div>
  );
});

export default ComponentToPrint;

